// export the validation errors component
// pass the errors captured on the server through the context api
export default function ValidationErrors({ errors }) {
  // don't render if no errors
  if (!errors || (Array.isArray(errors) && errors.length === 0)) return null;
  const errorList = Array.isArray(errors) ? errors : [errors];
  return (
    <div className="validation--errors">
      <h3>Validation Errors</h3>
      <ul>
        {/* map the arrays and display in a list */}
        {errorList.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
