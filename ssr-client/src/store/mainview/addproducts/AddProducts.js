import { useState, createRef } from "react";
import axios from 'axios';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import "./AddProducts.css";

const AddProducts = ({url}) => {
    const [message, setMessage] = useState("");

    // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);

    const [uploadUrl, setUploadUrl] = useState(0);

    // Create a ref for the file input element to access its files easily
    const fileInputRef = createRef();

    // Create an AbortController instance to provide an option to cancel the upload if needed.
    const abortController = new AbortController();

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const clearMessage = () => {
        setMessage("");
    };

    const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch("/auth");
            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    const saveProduct = () => {
        const title = document.querySelector('#pTitle').value;
        const highlights = document.querySelector('#pHighlights').value;
        const description = document.querySelector('#pDesc').value;
        const price = document.querySelector('#pPrice').value;
        const eligibleFor = document.querySelector('#pEligibleFor').options[document.querySelector('#pEligibleFor').selectedIndex].value;
        const primaryCat = document.querySelector('#pCategory').options[document.querySelector('#pCategory').selectedIndex].value;
        const thumbnailUrl = 'https://ik.imagekit.io/amuzely/tr:n-ik_ml_thumbnail/06c4ecec55b4cb2db03da5b984bbeb4b_EWQ2YMVEU.avif';
        const storeId = JSON.parse(window.sessionStorage.getItem('user-profile')).storeId;

        console.log('--title--', title);
        console.log('--highlights--', highlights);
        console.log('--description--', description);
        console.log('--price--', price);
        console.log('--eligibleFor--', eligibleFor);
        console.log('--primaryCat--', primaryCat);
        console.log('--thumbnailUrl--', thumbnailUrl);
        
        axios.post(`/createProduct`, {title: title, highlights: highlights, 
            description: description, price: price, 
            eligibleFor: eligibleFor, primaryCat: primaryCat,
            thumbnailUrl: thumbnailUrl, storeId: storeId}).then((response) => {
            console.log('--Create Product Response--', response);
            setTimeout(()=>{window.location.reload();},500);
        });       
        //window.location.reload();
    };

    const handleUpload = async () => {
        // Access the file input element using the ref
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        // Extract the first file from the file input
        const file = fileInput.files[0];

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                // Abort signal to allow cancellation of the upload if needed.
                abortSignal: abortController.signal,
            });
            setUploadUrl(uploadResponse.url);
            console.log("Upload response:", uploadResponse);
        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
        }
    };


    return (
        <div className="main">
           <div class="container">
                <h1>Add Product</h1>
                <input id="pTitle" type="text" placeholder="Title" />
                <input id="pHighlights" type="text" placeholder="Highlights (e.g. type: kidswear, age: 9-10)" />
                <textarea id="pDesc" placeholder="Description"></textarea>
                <input id="pPrice" type="number" placeholder="Price" />
                
                <select id="pEligibleFor" >
                <option disabled selected>Eligible for</option>
                <option>Online Purchase</option>
                <option>Online Enquiry</option>
                <option>Online Booking</option>
                </select>

                <select id="pCategory">
                <option selected>Default</option>
                <option>Season's Special</option>
                <option>New Arrival</option>
                </select>

                 {/* File input element using React ref */}
                    <input type="file" ref={fileInputRef} style={{width: '92%'}} />
                    {/* Button to trigger the upload process */}
                    <div className="footer-buttons"><button style={{background: 'linear-gradient(180deg, #595959, #000000)'}} type="button" onClick={handleUpload}>
                        Upload file
                    </button>
                    </div>
                    <br />
                    {/* Display the current upload progress */}
                    Upload progress: <progress value={progress} max={100}></progress>
            </div>

            <div class="footer-buttons">
                <button onClick={()=>{saveProduct()}}><span>Save & Add</span><i class="fas fa-plus"></i></button>
                <button><span>Finish</span><i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default AddProducts;
