import Link from "next/link";

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 text-center" style={{ width: "400px" }}>
        <h2 className="mb-3">Task Dashboard</h2>
        <p className="text-muted">
          Secure JWT-based full-stack task manager
        </p>

        <div className="d-grid gap-2 mt-3">
          <Link href="/login" className="btn btn-dark">
            Login
          </Link>
          <Link href="/register" className="btn btn-outline-dark">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
