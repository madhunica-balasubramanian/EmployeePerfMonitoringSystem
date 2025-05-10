export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">Contact Us</h1>
      <p className="text-gray-700 text-lg mb-4">
        For questions, suggestions, or collaboration opportunities, feel free to reach out.
      </p>
      <ul className="text-gray-700 text-lg">
        <li>Email: <a href="mailto:cmpe272-team@sjsu.edu" className="text-teal-600 underline">cmpe272-project-team@sjsu.edu</a></li>
        <li>Institution: San José State University</li>
        <li>Project Team: CMPE Graduate Student Group, Spring 2025</li>
      </ul>
    </main>
  );
}
