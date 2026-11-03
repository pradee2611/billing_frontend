export default function StatusMessage({ loading, error, empty, emptyText = "Nothing to show yet." }) {
  if (loading) return <div className="text-center text-secondary py-5"><div className="spinner-border spinner-border-sm me-2" />Loading…</div>;
  if (error) return <div className="alert alert-danger m-3">Could not load data. Make sure the backend is running.</div>;
  if (empty) return <div className="text-center text-secondary py-5">{emptyText}</div>;
  return null;
}
