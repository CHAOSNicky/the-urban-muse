import { useState, useEffect,  } from "react";
import { Link } from 'react-router-dom';

export default function Admin(){

    const[form, setForm] = useState({
      "product_name" : "",
      "product_desc" : "",
      "product_category" : "",
      "product_price" : "",
      "product_size" : "",
      "product_quantity" : "",
    });
    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const category = ["T-Shirt", "Shirt", "Trousers", "Boxers", "FullSet"]

    const onChange = (e) => {
        const{name, value} = e.target;
        setForm((f) => ({ ...f, [name]:value }))
    }

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        const filtered = files.filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
        setImages((prev) => [...prev, ...filtered].slice(0, 5));
        e.target.value = "";
    };

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

   const onSubmit = async (e) => {
    e.preventDefault();

    try{
        const requestBody = images.map(file =>({
        fileName : file.name,
        contentType : file.type,
        size : file.size
    }));

    const res = await fetch("http://localhost:8080/api/s3/pre-signed-put-url",{
        method : "POST",
        headers : {"Content-Type" : "application/json" },
        body : JSON.stringify(requestBody)
    })

    console.log("status:", res.status);
    if (!res.ok) {
    console.error("Presigning Failed", res.status, await res.text()); // 👈 see the real cause
    return;
    }

    const urls = await res.json(); // e.g. ["https://s3...","https://s3...",...]
    const imageKey = urls.map( p => p.key)

    // Upload in parallel (or with a small concurrency cap)
    await Promise.all(images.map((file, i) =>
    fetch(urls[i].url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
    }).then(r => {
        if (!r.ok) throw new Error(`Upload failed ${r.status} for ${file.name}`);
        console.log(`${file.name} uploaded. ETag:`, r.headers.get("ETag"));
    })
    ));

    console.log("All uploads done ✅");

    try{

        const prodData = {
            "productName" : form.product_name,
            "productDesc" : form.product_desc,
            "productCategory" : form.product_category,
            "productPrice" : form.product_price,
            "productSize" : form.product_size,
            "productQuantity" : form.product_quantity,
            imageKey
        }
        
        const saveprod = await fetch("http://localhost:8080/api/product/add-product",{
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(prodData)
        })

        if(!saveprod.ok){
            console.error("Presigning Failed", saveprod.status, await saveprod.text()); // 👈 see the real cause
            return;
        }

        const result = saveprod.json();
        console.log("Product Saved Successfully ✅");

    }
    catch(err){
        console.error("Error in onSubmit:", err)
    }

    }
    catch(err){
        console.error("Error in onSubmit:", err);
    }
  };

    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-600 to-gray-400">
            <div className="absolute top-5 left-7 z-50 cursor-pointer text-gray-600 hover:text-black transition-colors">
                <Link to="/" aria-label="Go To MainPage" className="inline-flex items-center justify-center rounded-full bg-white/80 backdrop-blur px-2 py-2 shadow ring-1 ring-gray-200 hover:shadow-md">
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                </Link>
            </div>

            <div className="py-6 text-center bg-white/70 backdrop-blur border-b border-gray-500 shadow-sm">
                <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">Welcome Admin</h1>
            </div>

            <form onSubmit={onSubmit} className="max-w-2xl mx-auto bg-white/50 backdrop-blur mt-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)] rounded-2xl border border-gray-500 p-8 space-y-6">

                <div className="flex flex-col gap-2">
                    <label htmlFor="product_name" className="font-medium text-gray-900">Product Name</label>
                    <input type="text"
                        id="product_name"
                        name="product_name"
                        placeholder="Product Name"
                        value={form.product_name}
                        onChange={onChange}
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />
                </div>

                 <div className="flex flex-col gap-2">
                    <label htmlFor="product_desc" className="font-medium text-gray-900">Product Description</label>
                    <input type="text"
                        id="product_desc"
                        name="product_desc"
                        placeholder="Product Description"
                        value={form.product_desc}
                        onChange={onChange}
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="product_category" className="font-medium text-gray-900">Product Category</label>
                    <select name="product_category"
                        id="product_category"
                        value={form.product_category}
                        onChange={onChange}
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    >
                        <option value="">-- Select Category --</option>
                        {category.map((c) =>(
                            <option key={c.toLowerCase()} value={c.toLowerCase()}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="product_price" className="font-medium text-gray-900">Product Price</label>
                    <input type="number"
                        id="product_price"
                        name="product_price"
                        placeholder="Product Price"
                        value={form.product_price}
                        onChange={onChange}
                        min="0"
                        step="0.01"
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="product_size" className="font-medium text-gray-900">Product Size</label>
                    <select name="product_size"
                        id="product_size"
                        value={form.product_size}
                        onChange={onChange}
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    >
                        <option value="">-- Select Size --</option>
                        <option value="xs">XS</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                        <option value="xxl">XXL</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="product_quantity" className="font-medium text-gray-900">Product Quantity</label>
                    <input
                        type="number"
                        id="product_quantity"
                        name="product_quantity"
                        placeholder="Product Quantity"
                        value={form.product_quantity}
                        onChange={onChange}
                        min="0"
                        step="1"
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label htmlFor="product_images" className="font-medium text-gray-900">Product Images</label>
                    <input
                        type="file"
                        id="product_images"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={onImagesChange}
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />

                    {images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-1">
                        {images.map((file, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-gray-900 shadow ring-1 ring-gray-200 hover:bg-white transition opacity-0 group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        </div>
                    )}

                    <p className="text-sm text-gray-500">Up to 5 images, ≤ 5MB each. JPG/PNG/WebP.</p>
                </div>

                <div className="pt-2 text-center">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-b from-gray-900 to-gray-700 text-white font-semibold shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60"
                    >
                        {submitting ? "Saving..." : "Save Product"}
                    </button>
                </div>
                
            </form>
        </div>
    );
}


//  // basic client-side checks
//     if (!form.product_name.trim()) return alert("Product name is required");
//     if (!form.product_category) return alert("Pick a category");
//     if (!form.product_size) return alert("Pick a size");
//     if (!form.product_price || Number(form.product_price) <= 0) return alert("Price must be > 0");
//     if (!form.product_quantity || Number(form.product_quantity) < 0) return alert("Quantity must be >= 0");

//     const data = new FormData();
//     Object.entries(form).forEach(([k, v]) => data.append(k, v));
//     images.forEach((file) => data.append("images", file)); // backend expects "images"[]

//     setSubmitting(true);
//     try {
//       // If using cookies/CSRF:
//       // const csrf = getCookie("XSRF-TOKEN");
//       const res = await fetch("/api/admin/products", {
//         method: "POST",
//         body: data,
//         credentials: "include",
//         // headers: csrf ? { "X-XSRF-TOKEN": csrf } : undefined,
//       });
//       if (!res.ok) throw new Error("Failed to save product");
//       alert("Product saved!");
//       // reset
//       setForm({ product_name: "", product_category: "", product_price: "", product_size: "", product_quantity: "" });
//       setImages([]);
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Error saving product");
//     } finally {
//       setSubmitting(false);
//     }