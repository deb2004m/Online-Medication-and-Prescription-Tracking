export default function DoctorDashboard() {

    const [textPrescription, setTextPrescription] = useState("");
    const [file, setFile] = useState(null);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };
    const submitTextPrescription = async () => {
        const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/doctor/prescriptions/text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prescription: textPrescription }),
            });
            alert("Text Prescription submitted successfully!");
    };
    const submitFilePrescription = async () => {
        const token = localStorage.getItem("token");
            const formData = new FormData();   
            formData.append("file", file);
            const res = await fetch("http://localhost:8080/api/doctor/prescriptions/file", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            alert("File Prescription submitted successfully!");
    };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Doctor Dashboard</h1>

      {/* TEXT PRESCRIPTION */}
      <textarea
        placeholder="Write prescription..."
        value={textPrescription}
        onChange={(e) => setTextPrescription(e.target.value)}
        rows="5"
        style={{ width: "300px" }}
      ></textarea>

      <button onClick={submitTextPrescription}>Submit Text Prescription</button>

      {/* FILE PRESCRIPTION */}
      <input type="file" accept=".jpg,.png,.pdf" onChange={handleFileUpload} />

      <button onClick={submitFilePrescription}>Upload File</button>
    </div>
  );
}