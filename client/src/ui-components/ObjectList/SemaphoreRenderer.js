function SemaphoreRenderer(props) {
  return (
    <span
      style={{
        height: "20px",
        width: "20px",
        backgroundColor: props.value ? "#2EAE0F" : "#D70D0D",
        borderRadius: "50%",
        display: "inline-block",
      }}
    />
  );
}

export default SemaphoreRenderer;
