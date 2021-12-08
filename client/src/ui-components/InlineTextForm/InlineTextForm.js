import { FormControl, InputGroup } from "react-bootstrap";
import Button from "../Button/Button";

function InlineTextForm(props) {
  function onValueChange(event) {
    const newVal = event.target.value;

    // Don't accept spaces only values
    if (newVal.trim() === "") {
      props.onValueChange("");
      return;
    }
    if (newVal !== props.value) props.onValueChange(newVal);
  }

  function onSubmit(event) {
    props.onSubmit(props.value);
  }

  return (
    <InputGroup className='my-3'>
      <FormControl
        placeholder={props.placeholder}
        value={props.value}
        onChange={onValueChange}
      />
      <Button onClick={onSubmit}>{props.actionLabel}</Button>
    </InputGroup>
  );
}

export default InlineTextForm;
