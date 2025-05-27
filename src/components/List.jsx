import React from "react";
import './List.css';

const List = ({ title, data, onMoveLeft, onMoveRight }) => {
  return (
    <div className="list-container">
      <h3>{title}</h3>
      <h4>items : {data.length}</h4>
      <ul>
        {data.map((item , index) => {

        
            index+=1;
          return ( <li key={item.id} className="list-item">
            {onMoveLeft && (
              <button onClick={() => onMoveLeft(item)} className="arrow-btn">⬅️</button>
            )}
            <span>#{index}  {item.name}</span>
            {onMoveRight && (
              <button onClick={() => onMoveRight(item)} className="arrow-btn">➡️</button>
            )}
          </li>) 
        })}
      </ul>
    </div>
  );
};

export default List;
