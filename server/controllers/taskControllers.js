const Task = require("../models/taskModel");
const activityLogger = require("../controllers/recentActivities");

//fetch all category controller
//status codes: (200, 500)
const getCategories = async (req, res) => {
  try {
    let existingTasks = await Task.findOne({ userId: req.user });

    //check records are empty
    if (!existingTasks) existingTasks = await Task({ userId: req.user }).save();

    res.status(200).json({
      categories: existingTasks.category,
      totalCount: existingTasks.getCounts
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//add new category controller
//status codes: (200, 400, 500)
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let existingTasks = await Task.findOne({ userId: req.user });

    //check if name is exisiting
    if (!name) {
      return res.status(400).send("Category name is required");
    }
    //check if there is existing record
    if (!existingTasks)
      existingTasks = await Task({
        userId: req.user
      }).save();

    //add new category
    existingTasks.category.push({ name: name });
    const savedData = await existingTasks.save();

    //log activity to database
    const newActivity = await activityLogger(
      `Added a new category named "${name}"`,
      req.user
    );

    res.status(200).json({
      categories: savedData.category,
      activities: newActivity.recent_activities,
      totalCount: existingTasks.getCounts
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//update category name controller
//status codes: (200, 400, 500)
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const newCategoryName = req.body.name;
    const existingCategory = await Task.findOne({
      userId: req.user,
      category: { $elemMatch: { _id: categoryId } }
    });
    const oldName = existingCategory.category.filter(
      (category) => category._id.toString() === categoryId
    )[0].name;

    //check if category name is empty
    if (!newCategoryName)
      return res.status(400).send("Category name is required");

    //check if there is existing category
    if (!existingCategory)
      return res
        .status(400)
        .send("The category you are trying to update does not exist.");

    //update category name
    existingCategory.category.filter(
      (category) => category._id.toString() === categoryId
    )[0].name = newCategoryName;
    const savedData = await existingCategory.save();

    //log activity to database
    const newActivity = await activityLogger(
      `Renamed a category from "${oldName}" to "${newCategoryName}"`,
      req.user
    );

    res.status(200).json({
      categories: savedData.category,
      activities: newActivity.recent_activities
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//delete category controller
//status codes: (200, 404, 500)
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const existingCategory = await Task.findOne({
      userId: req.user,
      category: { $elemMatch: { _id: categoryId } }
    });

    //check if the category is not exisiting
    if (!existingCategory)
      return res
        .status(404)
        .send("An error occured. This category doesn't exists.");

    //save category name for logger
    const categoryName = existingCategory.category.filter(
      (category) => category._id.toString() === categoryId
    )[0].name;

    //delete the selected document
    existingCategory.category = existingCategory.category.filter(
      (category) => category._id.toString() !== categoryId
    );
    const savedData = await existingCategory.save();

    //log activity to database
    const newActivity = await activityLogger(
      `Deleted a category named "${categoryName}"`,
      req.user
    );

    res.status(200).json({
      categories: savedData.category,
      activities: newActivity.recent_activities,
      totalCount: existingCategory.getCounts
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//add new task controller
//status codes: (200, 400, 404, 500)
const addTask = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, priority, dueDate } = req.body;
    const existingCategory = await Task.findOne({
      userId: req.user,
      category: { $elemMatch: { _id: categoryId } }
    });

    //check if name and priority level is empty
    if (!name || !priority)
      return res
        .status(400)
        .send("Name and priority level are required fields");

    //check if the category is not exisiting
    if (!existingCategory)
      return res
        .status(404)
        .send("An error occured. This category doesn't exists.");

    //get category name for logger
    const categoryName = existingCategory.category.filter(
      (category) => category._id.toString() === categoryId
    )[0].name;

    //add new task to the category
    existingCategory.category
      .filter((category) => category._id.toString() === categoryId)[0]
      .tasks.unshift({ name, description, priority, dueDate });
    const savedData = await existingCategory.save();

    //log activity to database
    const newActivity = await activityLogger(
      `Added a new task in "${categoryName}" labelled "${name}"`,
      req.user
    );

    return res.status(200).json({
      categories: savedData.category,
      activities: newActivity.recent_activities,
      totalCount: existingCategory.getCounts
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//update task status controller
//status codes: (200, 400, 500)
const updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.body.taskid;
    const categoryId = req.params.id;
    const existingCategory = await Task.findOne({
      userId: req.user,
      "category.tasks": { $elemMatch: { _id: taskId } }
    });

    //check if there is task id or category id
    if (!categoryId || !taskId)
      return res.status(400).send("Invalid action. Empty body");

    //check if existing category is empty
    if (!existingCategory)
      return res
        .status(400)
        .send("The task your are trying to update does not exist");

    //check if task is overdue
    const taskDueDate = existingCategory.category
      .filter((category) => category._id.toString() === categoryId)[0]
      .tasks.filter((task) => task._id.toString() === taskId)[0].dueDate;
    const isOverdue = taskDueDate ? new Date() > new Date(taskDueDate) : false;
    const taskName = existingCategory.category
      .filter((category) => category._id.toString() === categoryId)[0]
      .tasks.filter((task) => task._id.toString() === taskId)[0].name;

    //update task status
    existingCategory.category
      .filter((category) => category._id.toString() === categoryId)[0]
      .tasks.filter((task) => task._id.toString() === taskId)[0].overdue =
      isOverdue;
    existingCategory.category
      .filter((category) => category._id.toString() === categoryId)[0]
      .tasks.filter((task) => task._id.toString() === taskId)[0].status =
      "completed";
    const savedData = await existingCategory.save();

    //log activity to database
    const newActivity = await activityLogger(
      `"${taskName}" task marked as completed`,
      req.user
    );

    return res.status(200).json({
      categories: savedData.category,
      activities: newActivity.recent_activities,
      totalCount: existingCategory.getCounts
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//delete task controller
//status codes: (200, 400, 500)
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskid;
    const categoryId = req.params.categoryid;
    const existingCategory = await Task.findOne({
      userId: req.user,
      "category.tasks": { $elemMatch: { _id: taskId } }
    });

    //check if there is task id or category id
    if (!categoryId || !taskId)
      return res.status(400).send("Invalid action. Empty body");

    //check if existing category is empty
    if (!existingCategory)
      return res
        .status(400)
        .send("The task your are trying to delete does not exist");

    //get name of the task to be deleted
    const taskName = existingCategory.category
      .filter((category) => category._id.toString() === categoryId)[0]
      .tasks.filter((task) => task._id.toString() === taskId)[0].name;

    //delete a task
    existingCategory.category.filter(
      (category) => category._id.toString() === categoryId
    )[0].tasks = existingCategory.category
      .filter((category) => category._id.toString() === categoryId)[0]
      .tasks.filter((task) => task._id.toString() !== taskId);
    const savedData = await existingCategory.save();

    //log activity to database
    const newActivity = await activityLogger(
      `Deleted a task labelled "${taskName}"`,
      req.user
    );

    res.status(200).json({
      categories: savedData.category,
      totalCount: existingCategory.getCounts,
      activities: newActivity.recent_activities
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//update single task
//status codes: (200, 400, 500)
const updateTask = async (req, res) => {
  try {
    const categoryId = req.params.categoryid;
    const taskId = req.params.taskid;
    const { name, description, priority, dueDate } = req.body;

    //check if name and priority level is empty
    if (!name || !priority)
      return res
        .status(400)
        .send("Name and priority level are required fields");

    //check if there is task id or category id
    if (!categoryId || !taskId)
      return res.status(400).send("Invalid action. Empty body");

    //update task
    const updateTask = await Task.updateOne(
      { "category.tasks": { $elemMatch: { _id: taskId } } },
      {
        "category.$[category].tasks.$.name": name,
        "category.$[category].tasks.$.description": description,
        "category.$[category].tasks.$.priority": priority,
        "category.$[category].tasks.$.dueDate": dueDate
      },
      { arrayFilters: [{ "category._id": categoryId }] }
    );

    //check if update operation is valid
    if (!updateTask.acknowledged && updateTask.matchedCount !== 1)
      return res
        .status(400)
        .send("The task your are trying to delete does not exist");

    //get the updated categories
    const existingCategory = await Task.findOne({
      userId: req.user,
      "category.tasks": { $elemMatch: { _id: taskId } }
    });

    //get name of the task to be deleted
    const categoryName = existingCategory.category.filter(
      (category) => category._id.toString() === categoryId
    )[0].name;

    //log activity to database
    const newActivity = await activityLogger(
      `Updated a task in "${categoryName}" category`,
      req.user
    );

    res.status(200).json({
      categories: existingCategory.category,
      totalCount: existingCategory.getCounts,
      activities: newActivity.recent_activities
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  addTask,
  updateTaskStatus,
  deleteTask,
  updateTask
};
