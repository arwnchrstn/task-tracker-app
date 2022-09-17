const router = require("express").Router();
const taskController = require("../controllers/taskControllers");

//fetch all category router
router.get("/", taskController.getCategories);

//add category router
router.post("/add", taskController.addCategory);

//update category route
router.put("/:id/edit", taskController.updateCategory);

//delete category router
router.delete("/:id/delete", taskController.deleteCategory);

//add task router
router.post("/:id/addtask", taskController.addTask);

//update task status router
router.put("/:id/update-status", taskController.updateTaskStatus);

//delete task router
router.delete("/:categoryid/delete-task/:taskid", taskController.deleteTask);

//update task router
router.put("/:categoryid/edit-task/:taskid", taskController.updateTask);

module.exports = router;
