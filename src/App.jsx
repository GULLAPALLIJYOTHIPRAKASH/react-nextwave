import React, { useState, useEffect } from "react";
import List from "./components/List";
import './App.css';

const API_URL = "https://apis.ccbp.in/list-creation/lists";

function App (){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [newList, setNewList] = useState([]);
  const [view, setView] = useState("all"); // all | create
  const [checkedLists, setCheckedLists] = useState({ list1: false, list2: false });


  // Api fetching fn
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      const items = data.lists;
      const mid = Math.ceil(items.length / 2);
      setList1(items.slice(0, mid));
      setList2(items.slice(mid));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  // run when page load
  useEffect(() => {
    fetchData();
  }, []);

  // handle list checkboxs
  const handleCheckboxChange = (listName) => {
    setCheckedLists(prev => ({ ...prev, [listName]: !prev[listName] }));
  };

  // hanlde to creating new list
  const handleCreateNewList = () => {
    const checked = Object.values(checkedLists).filter(Boolean);
    if (checked.length !== 2) {
      setError("You should select exactly 2 lists to create a new list");
      return;
    }
    setError(null);
    setNewList([]);
    setView("create");
  };


  // it moves items from one to another
  const moveItem = (item, fromListSetter, toListSetter) => {
    fromListSetter(prev => prev.filter(i => i.id !== item.id));
    toListSetter(prev => [...prev, item]);
  };


  // handle cancel for list
  const handleCancel = () => {
    fetchData();
    setView("all");
    setCheckedLists({ list1: false, list2: false });
  };

  // handle update for list
  const handleUpdate = () => {
    setView("all");
    setCheckedLists({ list1: false, list2: false });
  };

  // display loading & error msg
  if (loading) return <div className="loader">Loading...</div>;
  if (error && view === "all") return <div className="error-container"><p>{error}</p><button onClick={fetchData} className="retry-btn">Try Again</button></div>;

  return (
    <div className="container">
      {view === "all" && (
        <>
        <main className="header">
        <h2 className="text-center">List Creation</h2>
        <button onClick={handleCreateNewList} className="create-btn">Create New List</button>
        </main>
          <div className="checkbox-header">
            <label><input type="checkbox" checked={checkedLists.list1} onChange={() => handleCheckboxChange("list1")} /> List 1</label>
            <label><input type="checkbox" checked={checkedLists.list2} onChange={() => handleCheckboxChange("list2")} /> List 2</label>
          </div>
          <div className="lists">
            <List title="List 1" data={list1} />
            <List title="List 2" data={list2} />
          </div>
        </>
      )}

      {view === "create" && (
        <>
          <div className="lists">
            <List title="List 1" data={list1} onMoveRight={(item) => moveItem(item, setList1, setNewList)} />
            <List title="New List" data={newList} onMoveLeft={(item) => moveItem(item, setNewList, setList1)} onMoveRight={(item) => moveItem(item, setNewList, setList2)} />
            <List title="List 2" data={list2} onMoveLeft={(item) => moveItem(item, setList2, setNewList)} />
          </div>
          <div className="buttons">
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            <button onClick={handleUpdate} className="update-btn">Update</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;