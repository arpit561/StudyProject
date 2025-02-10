const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    //return response
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAllCategorys handler function
exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      message: "All Categorys returned successfully",
      data: allCategorys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// categoryPageDetails--->
exports.categoryPageDetails = async (req, res) => {
  try {
    // get categoryId
    const { categoryId } = req.body;

    // Get courses for the specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .select("description")
      .populate({
        path: "courses",
        // match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();
    console.log("Fetched Category:", selectedCategory);

    // validation
    if (!selectedCategory) {
      console.log("Category not found.");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // const selectedCourses = selectedCategory.courses;

    // Get courses for other categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId }, //not equal
    })
      .populate("courses")
      .exec();

    let differentCourses = [];
    for (const category of differentCategories) {
      differentCourses.push(...category.courses);
    }

    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        populate: {
          path: "instructor",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // Find top-selling and top-rated courses
    const topCourses = allCourses
      .sort((a, b) => {
        // Sort primarily by sales, then by average rating
        if (b.sold === a.sold) {
          const avgRatingA =
            a.ratingAndReviews.reduce((acc, r) => acc + r.rating, 0) /
              a.ratingAndReviews.length || 0;
          const avgRatingB =
            b.ratingAndReviews.reduce((acc, r) => acc + r.rating, 0) /
              b.ratingAndReviews.length || 0;
          return avgRatingB - avgRatingA; // Sort by rating if sales are equal
        }
        return b.sold - a.sold; // Sort by sales
      })
      .slice(0, 10); // Get top 10 courses

    // return response
    res.status(200).json({
      success: true,
      selectedCategory: selectedCategory,
      differentCategories: differentCategories,
      differentCourses: differentCourses,
      mostSellingCourses: mostSellingCourses,
      topCourses: topCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
