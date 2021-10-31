import SQLite from "react-native-sqlite-storage";

// create exportable wrapper class around db
const db = SQLite.openDatabase(
  {
    name: 'TestDB',
    location: 'default'
  },
  () => {},
  error => {console.log(error)}
);

const setData = async (date, label, image) => { // adds new data to table 
  await db.transaction(async (tx) => {
    await tx.executeSql(
      "INSERT INTO Logs (Date, Label, Image) VALUES (?, ?, ?)",
      [date, label, image]
    )
  })
}
  
const getData = () => { // retrieves data from table
  let dates = [], labels = [], images = [];

  db.transaction((tx) => {
    tx.executeSql(
      "SELECT Date, Label, Image FROM Logs",
      [],
      (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          dates.push(results.rows.item(i).Date);
          labels.push(results.rows.item(i).Label);
          images.push(results.rows.item(i).Image);
        }
      }
    )
  })

  return [dates, labels, images];
}

export {db, setData, getData}