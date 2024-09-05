export default function ValidationErrors({ errors }) {
  if (!errors || (Array.isArray(errors) && errors.length === 0)) return null;
  const errorList = Array.isArray(errors) ? errors : [errors];
  return (
    <div className="validation--errors">
      <h3>Validation Errors</h3>
      <ul>
        {errorList.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
