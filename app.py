from flask import Flask, request, jsonify, render_template
from vector_database import get_policy_response, simplify_contract, check_content_safety, generate_invoice, ask_rohit

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates"
)

@app.route("/")
def index():
    return render_template("advisor.html")


@app.route("/api/contract/simplify", methods=["POST"])
def simplify():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "Contract text missing"})
    summary = simplify_contract(text)
    return jsonify({"summary": summary})


@app.route("/api/content/check", methods=["POST"])
def content_check():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "Content text missing"})
    report = check_content_safety(text)
    return jsonify({"report": report})


@app.route("/api/invoice/generate", methods=["POST"])
def invoice():
    data = request.json
    try:
        brand = data["brand"]
        service = data["service"]
        amount = float(data["amount"])
        include_gst = data.get("include_gst", False)
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid input"})
    
    invoice_text = generate_invoice(brand, service, amount, include_gst)
    return jsonify({"invoice_text": invoice_text})


@app.route("/api/youtube/policy", methods=["POST"])
def youtube_policy():
    data = request.json
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "Question is required"})
    answer = get_policy_response(question)
    return jsonify({"answer": answer})


@app.route("/api/ama/ask", methods=["POST"])
def ama():
    data = request.json
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "Question is required"})
    answer = ask_rohit(question)
    return jsonify({"answer": answer})


if __name__ == "__main__":
    app.run(debug=True)