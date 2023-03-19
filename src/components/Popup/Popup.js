import React from "react";

export const Popup = ({date, weekDay, time, updateVisit, cancel}) => {

    return (
        <>
            <div className="confirmation-popup">
                <p>Rezerwujesz wizytę na {weekDay}, {date} o godzinie {time}</p>
                <div>
                    <button onClick={() => updateVisit(time)}>Akceptuj</button>
                    <button onClick={() => cancel(time, date)}>Anuluj</button>
                </div>
            </div>
        </>
    )
}