const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    let year_info = 2021;
    if (label === "JAN" || label === 1 || label === 2) year_info = 2022;
    return (
      <div className="custom-tooltip">
        <p className="label-tooltip">{`${label}-${year_info}`}</p>
        <p className="unretrieved-info">{`unretrieved orders : ${payload[0].value}`}</p>
        <p className="total-info">{`total orders : ${payload[1].value}`}</p>
        {payload[0].value && payload[1].value ? (
          <p>{`% of unretrieved orders : ${(
            (payload[0].value / payload[1].value) *
            100
          ).toFixed(2)}`}</p>
        ) : (
          <p>{`% of unretrieved orders : N/A`}</p>
        )}
      </div>
    );
  }

  return null;
};

export { CustomTooltip };
