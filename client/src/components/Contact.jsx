import React, { useEffect, useState } from "react";

export default function Contact({ listing }) {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/contact/${listing.userRef}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch landlord: ${res.status}`);
        }

        const data = await res.json();
        setLandLord(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (listing?.userRef) fetchLandLord();
  }, [listing?.userRef]);

  const sendMessage = () => {
    if (!message.trim()) {
      alert("Please write a message before sending.");
      return;
    }

    const subject = `Regarding ${listing.name}`;
    const mailtoUrl = `mailto:${landLord.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      const stillOnPage = document.hasFocus();
      if (stillOnPage) {
        const userWantsCopy = confirm(
          "We couldn't open your email app automatically. Would you like us to copy the landlord's email address so you can send the message yourself?"
        );
        if (userWantsCopy) {
          navigator.clipboard
            .writeText(landLord.email)
            .then(() => {
              alert(
                `✓ Email address copied!\n\nLandlord's email: ${landLord.email}\n\nWhat to do next:\n1. Open your email app (Gmail, Outlook, etc.)\n2. Create a new email\n3. Paste the email address\n4. Use this subject: ${subject}\n5. Copy and paste your message: "${message}"`
              );
            })
            .catch(() => {
              alert(
                `Here's how to contact the landlord:\n\nSend an email to: ${landLord.email}\n\nSubject line: ${subject}\n\nYour message: "${message}"\n\nTip: You can copy this information and paste it into your email app.`
              );
            });
        }
      }
    }, 2500);
  };

  const copyEmail = () => {
    navigator.clipboard
      .writeText(landLord.email)
      .then(() => {
        alert(
          `✓ Copied! The landlord's email address (${landLord.email}) has been copied. You can now paste it into your email app.`
        );
      })
      .catch(() => {
        alert(
          `Landlord's email address: ${landLord.email}\n\nTip: You can select and copy this email address to use in your email app.`
        );
      });
  };

  if (loading) {
    return <p className="text-center">Loading landlord information...</p>;
  }

  if (error) {
    return (
      <div className="text-red-600">
        <p>Error: {error}</p>
        <p className="text-sm text-gray-600">Please try again later.</p>
      </div>
    );
  }

  if (!landLord) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <p>
        Contact <span className="font-semibold">{landLord.username}</span> for{" "}
        <span className="font-semibold">{listing.name?.toLowerCase()}</span>
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message here..."
        rows="3"
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={sendMessage}
        className="bg-[#424b1e] text-white p-3 rounded-lg hover:bg-[#2f380f] transition-colors uppercase"
      >
        Send Message
      </button>

      <button
        onClick={copyEmail}
        className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
      >
        Copy Email Address
      </button>
    </div>
  );
}
