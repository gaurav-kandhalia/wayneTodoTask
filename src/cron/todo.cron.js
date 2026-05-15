import cron from "node-cron";

import { Todo } from "../models/todo.model.js";



const startTodoCron = () => {
   // one hour timer
    cron.schedule("* * * * *", async () => {

        console.log("Running overdue todo cron job...");

        try {

            const result = await Todo.updateMany(
                {
                    status: "pending",

                    dueDate: { $lt: new Date() },

                    isOverdue: false,
                },
                {
                    $set: {
                        isOverdue: true,
                    },
                }
            );
              console.log("-------------result----------",result)
            console.log(
              `${result.modifiedCount} todos marked overdue`
            );

        } catch (error) {

            console.log(
              "Cron job error:",
              error
            );

        }

    });

};


export { startTodoCron };