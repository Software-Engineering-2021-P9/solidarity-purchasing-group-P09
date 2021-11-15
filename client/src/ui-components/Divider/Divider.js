import "./Divider.css";

function Divider(props) {
  function getVariantClass(variant) {
    switch (variant) {
      case "light":
        return "#f4bfa7";
      case "primary":
      default:
        return "#db9471";
    }
  }

  return (
    <hr
      style={{
        backgroundColor: getVariantClass(props.variant),
        height: props.size + "px" || "1px",
      }}
    />
  );
}

export default Divider;
