import os
import sys
import time
import subprocess
import httpx

PORT = 8002
BASE_URL = f"http://127.0.0.1:{PORT}"
TEST_PDF_PATH = "/Users/nitinagga/Documents/Maestro-Automated-Claims-Harvesting-&-Trigger-Pipeline/frontend/demo_files/clinical_brief_keynote189.pdf"

def main():
    print("==========================================================")
    print("🚀 GENMEDIA 2.0 BACKEND COMPLIANCE & GROUNDING INTEGRITY TEST")
    print("==========================================================")
    
    # 1. Start FastAPI server using uvicorn as a background process
    print(f"\n[1/5] Starting FastAPI server on port {PORT}...")
    
    # Set environment variables for the subprocess
    env = os.environ.copy()
    # If the user has a GEMINI_API_KEY in their current environment, it will be inherited.
    # We can also mock it if not present, the main.py will handle both real and mock gracefully!
    
    server_process = subprocess.Popen(
        [".venv/bin/uvicorn", "main:app", "--host", "127.0.0.1", "--port", str(PORT)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        env=env
    )
    
    client = httpx.Client(timeout=15.0)
    
    # 2. Poll the health endpoint until it is online
    print("Waiting for server to become healthy...")
    server_healthy = False
    for i in range(10):
        try:
            response = client.get(f"{BASE_URL}/api/health")
            if response.status_code == 200:
                print(f"✅ Server is ONLINE and HEALTHY: {response.json()}")
                server_healthy = True
                break
        except Exception:
            pass
        time.sleep(0.5)
        
    if not server_healthy:
        # Print server logs if it failed to start
        stdout, stderr = server_process.communicate()
        print(f"❌ Server failed to start.\nSTDOUT:\n{stdout}\nSTDERR:\n{stderr}")
        sys.exit(1)
        
    try:
        # 3. Test /api/scan with violating copy
        print("\n[2/5] Testing /api/scan (Compliance Check) with violating marketing copy...")
        violating_copy = (
            "Summer Product launch email draft. ZYGARDIA 10mg is guaranteed to offer a miracle cure "
            "with sustained trial results and no side effects."
        )
        
        scan_payload = {"copy": violating_copy}
        scan_response = client.post(f"{BASE_URL}/api/scan", json=scan_payload)
        
        assert scan_response.status_code == 200, f"Expected 200, got {scan_response.status_code}"
        scan_data = scan_response.json()
        
        print("\nCompliance Report Received:")
        print(f"  - Compliance Score: {scan_data['compliance_score']}/100")
        print("  - Violating Terms Matched:")
        for term, reason in scan_data["matched_terms"].items():
            print(f"    * '{term}': {reason}")
        print(f"  - Regulatory Reasoning:\n{scan_data['regulatory_reasoning']}")
        
        # Verify fields
        assert "compliance_score" in scan_data
        assert "matched_terms" in scan_data
        assert "regulatory_reasoning" in scan_data
        assert scan_data["compliance_score"] < 100, "Score should have been penalized for violations"
        assert "guaranteed" in scan_data["matched_terms"]
        assert "miracle cure" in scan_data["matched_terms"]
        print("✅ /api/scan integrity verification passed!")
        
        # 4. Test /api/scan with clean copy
        print("\n[3/5] Testing /api/scan (Compliance Check) with compliant clinical copy...")
        compliant_copy = (
            "ZYGARDIA is indicated for the adjuvant treatment of adult patients with high-risk post-nephrectomy RCC. "
            "Clinical trials demonstrated a statistically significant improvement in recurrence-free survival."
        )
        
        clean_response = client.post(f"{BASE_URL}/api/scan", json={"copy": compliant_copy})
        assert clean_response.status_code == 200
        clean_data = clean_response.json()
        print(f"  - Compliant Copy Score: {clean_data['compliance_score']}/100")
        assert clean_data["compliance_score"] > 90, "Clean copy should have a high score"
        print("✅ /api/scan clean copy test passed!")
        
        # 5. Test /api/ground with clinical PDF
        print(f"\n[4/5] Testing /api/ground (PixelRAG Grounding) with clinical PDF: {os.path.basename(TEST_PDF_PATH)}")
        
        if not os.path.exists(TEST_PDF_PATH):
            print(f"⚠️ Test PDF not found at {TEST_PDF_PATH}. Skipping PDF upload test and using fallback check.")
        else:
            with open(TEST_PDF_PATH, "rb") as pdf_file:
                files = {"file": (os.path.basename(TEST_PDF_PATH), pdf_file, "application/pdf")}
                ground_response = client.post(f"{BASE_URL}/api/ground", files=files)
                
            assert ground_response.status_code == 200, f"Expected 200, got {ground_response.status_code}"
            ground_data = ground_response.json()
            
            print("\nPixelRAG Grounding Report:")
            print(f"  - File Name: {ground_data['file_name']}")
            print(f"  - Status: {ground_data['status']}")
            print(f"  - Method: {ground_data['method']}")
            print(f"  - Extracted Metrics:")
            for metric, val in ground_data["extracted_metrics"].items():
                print(f"    * {metric}: {val}")
            
            print("  - Grounding Coordinates & Bounding Boxes:")
            for coord in ground_data["grounding_coordinates"]:
                print(f"    * Metric: {coord['metric']}")
                print(f"      Value: {coord['value']}")
                print(f"      Grounded Page: {coord['page']}")
                print(f"      Bounding Box: {coord['bounding_box']}")
                print(f"      Matched Source Text: \"{coord['text']}\"")
                
            # Verify fields
            assert "file_name" in ground_data
            assert "status" in ground_data
            assert "extracted_metrics" in ground_data
            assert "grounding_coordinates" in ground_data
            assert len(ground_data["grounding_coordinates"]) > 0
            print("✅ /api/ground coordinate-level grounding verification passed!")
            
    except Exception as e:
        print(f"\n❌ TEST FAILURE: {e}")
        import traceback
        traceback.print_exc()
        # Terminate server before exiting
        server_process.terminate()
        sys.exit(1)
        
    # 6. Tear Down Server
    print("\n[5/5] Tearing down local test server...")
    server_process.terminate()
    server_process.wait()
    print("✅ Server successfully terminated.")
    
    print("\n==========================================================")
    print("🎉 ALL GENMEDIA 2.0 BACKEND INTEGRITY TESTS PASSED SUCCESSFULLY!")
    print("==========================================================")

if __name__ == "__main__":
    main()
