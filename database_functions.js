import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
      name: 'TestDB',
      location: 'default'
    },
    () => {},
    error => {console.log(error)}
  );
  
  const setData = (date, label, image) => {
    const promise = new Promise((resolve, reject) => {
     db.transaction(tx => {
      tx.executeSql(
       'INSERT INTO Logs2 (Date, Label, Image) VALUES (?, ?, ?);',
       [date, label, image],
       (result) => {
        console.log("INSERTED: ", result);
        resolve(result);
       },
       (err) => {
        reject(err);
       }
      );
     });
    });
    return promise;
   }
    
  const getData = (resolveFunc) => { // retrieves data from table
    let dates = [];
    let labels = [];
    let images = [];
  
    // create promise that selects all data from table
    const promise = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Logs2;',
          [],
          (tx, results) => {
            console.log("SELECTED: ", results);
            for (let i = 0; i < results.rows.length; i++) {
              dates.push(results.rows.item(i).Date);
              labels.push(results.rows.item(i).Label);
              images.push(results.rows.item(i).Image);
            }
            resolve({dates, labels, images});
            resolveFunc([dates, labels, images]);
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

export {db, setData, getData};
