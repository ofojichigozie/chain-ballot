function Button({ text, classes, disabled, loading, onClick }) {
  if (loading) {
    return (
      <button className={classes} disabled={disabled}>
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      </button>
    );
  }

  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
