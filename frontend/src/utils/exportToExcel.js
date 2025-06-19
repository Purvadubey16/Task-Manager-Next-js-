import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


export const exportTasksToExcel = (tasks, fileName = "tasks") => {
  // fromat data in kay -value pairs
  const formattedTasks = tasks.map((task, index) => ({
    "Sr No.": index + 1,
    "Title": task.title,
    "Status": task.status,
    "Assign By":task.assign,
    "Due Date":new Date(task.deadline).toLocaleDateString("en-IN"),
    "Priority": task.priority,
    "Created At":new Date(task.created).toLocaleDateString("en-IN"),
  }));

  //convert data into sheet
const worksheet = XLSX.utils.json_to_sheet(formattedTasks);

//creating a new file/workbook
const workbook = XLSX.utils.book_new();

//add sheet to workbook , sheet name is "tasks"
XLSX.utils.book_append_sheet(workbook,worksheet,'Tasks');

//convert book into binary format
const excelBuffer = XLSX.write(workbook, { type: 'array', bookType:"xlsx"})

//wrap binary data in a blob (a binary large object).fromat require for downloading file in browser
const blob = new Blob([excelBuffer],{
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
})

//use file -saver to save the file(saveAs)
saveAs(blob,`${fileName}.xlsx`);
};