import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="container">
        <h1>GymFlow CRM</h1>

        <p>Manage your gym members, payments and attendance easily.</p>

        <button>Login</button>
      </div>
    </>
  );
}