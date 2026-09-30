
"use client";

import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";

export default function Home() {
  const [name, setName] = useState("");
  const [generatedName, setGeneratedName] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef(0);

  // Load the font once
  useEffect(() => {
    async function loadFont() {
      try {
        const font = new FontFace(
          "CertificateBangla",
          'url("/fonts/solaimanlipi.ttf")',
          { weight: "400" }
        );

        const loaded = await font.load();
        document.fonts.add(loaded);
      } catch (err) {
        console.error("Font loading error:", err);
      }
    }

    loadFont();
  }, []);

  // Reset everything
  function resetForm() {
    requestRef.current += 1;
    setName("");
    setGeneratedName("");
    setPreview("");
    setGenerating(false);
    setError("");
  }

  // Generate certificate only when button is clicked
  async function generateCertificate() {
    const cleanName = name.trim();

    if (!cleanName) {
      setError("অনুগ্রহ করে আপনার সম্পূর্ণ নাম লিখুন।");
      return;
    }

    const requestId = ++requestRef.current;

    setGenerating(true);
    setError("");
    setPreview("");
    setGeneratedName("");

    try {
      // Ensure Bengali font is loaded
      await document.fonts.load(
        "normal 36px CertificateBangla"
      );

      if (
        !document.fonts.check(
          "normal 36px CertificateBangla"
        )
      ) {
        throw new Error("বাংলা ফন্ট লোড হয়নি");
      }

      const image = new Image();
      image.src = "/certificate.png";
      await image.decode();

      if (requestId !== requestRef.current) return;

      const canvas = canvasRef.current;

      if (!canvas) {
        throw new Error("Canvas পাওয়া যায়নি");
      }

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context পাওয়া যায়নি");
      }

      // Original certificate background
      ctx.drawImage(image, 0, 0);

      // Name styling
      let fontSize = canvas.width * 0.045;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#164B35";

      // Resize longer names
      while (fontSize > 12) {
        ctx.font = `${fontSize}px CertificateBangla`;

        if (
          ctx.measureText(cleanName).width <=
          canvas.width * 0.52
        ) {
          break;
        }

        fontSize -= 2;
      }

      ctx.font = `${fontSize}px CertificateBangla`;

      // Name position
      ctx.fillText(
        cleanName,
        canvas.width / 2,
        canvas.height * 0.49,
        canvas.width * 0.52
      );

      const generatedImage =
        canvas.toDataURL("image/png");

      if (requestId !== requestRef.current) return;

      setPreview(generatedImage);
      setGeneratedName(cleanName);
    } catch (err) {
      console.error("Generation error:", err);

      if (requestId === requestRef.current) {
        setError(
          "সার্টিফিকেট তৈরি করা যায়নি। ফন্ট ও ব্যাকগ্রাউন্ড ফাইল পরীক্ষা করুন।"
        );
      }
    } finally {
      if (requestId === requestRef.current) {
        setGenerating(false);
      }
    }
  }

  // Download PDF
  async function downloadCertificate() {
    if (!preview || !generatedName || loading) return;

    setLoading(true);
    setError("");

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      pdf.addImage(
        preview,
        "PNG",
        0,
        0,
        297,
        210
      );

      pdf.save(
        "Bangla-Utsob-Volunteer-Certificate.pdf"
      );

      // Clear form after initiating download
      resetForm();
    } catch (err) {
      console.error("Download error:", err);

      setError(
        "ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f0faf4] px-4 py-10">

      <style jsx global>{`
        @font-face {
          font-family: CertificateBangla;
          src: url("/fonts/solaimanlipi.ttf")
            format("truetype");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <canvas
        ref={canvasRef}
        className="hidden"
      />

      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-10">

          {/* Heading */}

          <div className="mb-7 text-center">

            <h1 className="mb-2 text-3xl font-bold text-green-900 md:text-4xl">
              কৃতজ্ঞতার স্মারক
            </h1>

            <p className="text-lg font-semibold text-green-800">
              ৪র্থ বাংলা উৎসব ১৪৩৩ বঙ্গাব্দ
            </p>

            <div className="mx-auto my-5 h-1 w-20 rounded bg-yellow-500" />

            <p className="mx-auto max-w-lg text-base leading-8 text-gray-600">
              ‘৪র্থ বাংলা উৎসব ১৪৩৩ বঙ্গাব্দ’
              সফলভাবে আয়োজনে আপনার আন্তরিক
              সহযোগিতা, নিষ্ঠা ও মূল্যবান অবদানের
              স্বীকৃতিস্বরূপ সূচনা ছাত্র সংগঠনের
              পক্ষ থেকে রইল আন্তরিক কৃতজ্ঞতা।
            </p>

          </div>

          {/* Name input */}

          <div className="mb-5">

            <label
              htmlFor="volunteer-name"
              className="mb-2 block text-base font-semibold text-gray-800"
            >
              আপনার সম্পূর্ণ নাম লিখুন
            </label>

            <input
              id="volunteer-name"
              type="text"
              value={name}
              maxLength={80}
              onChange={(e) => {
                requestRef.current += 1;
                setName(e.target.value);
                setPreview("");
                setGeneratedName("");
                setGenerating(false);
                setError("");
              }}
              placeholder="বাংলায় আপনার পূর্ণ নাম লিখুন"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-lg text-gray-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-2 text-sm text-gray-500">
              আপনার নামের বানান যাচাই করে নিন।
              এই নামটিই সার্টিফিকেটে ব্যবহার করা হবে।
            </p>

          </div>

          {/* Generate button */}

          <button
            type="button"
            onClick={generateCertificate}
            disabled={!name.trim() || generating || loading}
            className="w-full rounded-xl bg-green-800 px-5 py-4 text-lg font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating
              ? "সার্টিফিকেট তৈরি হচ্ছে..."
              : "সার্টিফিকেট তৈরি করুন"}
          </button>

          {/* Error */}

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Preview only after generation */}

          {preview && generatedName && (
            <div className="mt-8">

              <h2 className="mb-2 text-center text-xl font-semibold text-green-900">
                আপনার সার্টিফিকেট প্রস্তুত!
              </h2>

              <p className="mb-4 text-center text-sm text-gray-600">
                ডাউনলোড করার আগে আপনার নাম
                ও বানান যাচাই করুন।
              </p>

              <div className="overflow-hidden rounded-lg border border-green-200 bg-white shadow-sm">

                <img
                  src={preview}
                  alt={`${generatedName}-এর সার্টিফিকেট`}
                  className="w-full"
                />

              </div>

              {/* Download button */}

              <button
                type="button"
                onClick={downloadCertificate}
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-[#17633B] px-5 py-4 text-lg font-semibold text-white transition hover:bg-green-900 disabled:opacity-50"
              >
                {loading
                  ? "ডাউনলোড হচ্ছে..."
                  : "সার্টিফিকেট ডাউনলোড করুন"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                নাম সংশোধন করুন
              </button>

            </div>
          )}

          {/* Footer */}

          <div className="mt-9 border-t border-gray-200 pt-6 text-center">

            <h3 className="text-lg font-bold text-green-900">
              সূচনা ছাত্র সংগঠন
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              এসএসসি ব্যাচ ২০২০, বহদ্দারকাটা উচ্চ বিদ্যালয়
            </p>

            <p className="mt-2 text-sm text-green-700">
              ভালো কিছু শুরু হোক
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}
