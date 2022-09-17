const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  category: [
    {
      name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        min: [5, "Minimum of at least 5 characters"],
        max: [50, "Maximum of 50 characters"]
      },
      tasks: [
        {
          name: {
            type: String,
            required: [true, "Task name is required"],
            trim: true,
            max: [120, "Maximum of 120 characters"]
          },
          description: {
            type: String,
            trim: true,
            max: [120, "Maximum of 120 characters"]
          },
          status: {
            type: String,
            required: true,
            enum: ["ongoing", "completed"],
            default: "ongoing"
          },
          priority: {
            type: Number,
            enum: [1, 2, 3]
          },
          dueDate: {
            type: Date
          },
          dateCompleted: {
            type: Date
          },
          overdue: {
            type: Boolean,
            default: false
          },
          dateCreated: {
            type: Date,
            required: true,
            default: () => {
              return Date.now();
            }
          }
        }
      ]
    }
  ]
});

//get counts
taskSchema.virtual("getCounts").get(function () {
  let totalCount = {
    categories: 0,
    tasks: 0,
    ongoing: 0,
    completed: 0,
    overdue: 0
  };

  this.category.forEach((items) => {
    totalCount.categories++;

    items.tasks.forEach((task) => {
      totalCount.tasks++;

      if (task.status === "ongoing") totalCount.ongoing++;
      if (task.status === "completed") totalCount.completed++;
      if (task.overdue === true) totalCount.overdue++;
    });
  });

  return totalCount;
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
