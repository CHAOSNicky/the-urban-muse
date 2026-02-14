import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Admin(){

    const fetchCategories = () => {
    fetch("http://localhost:8080/api/product/get-category")
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error("Failed to fetch categories", err));
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    newArrival: false,
    variants: [
        {
        size: "",
        quantity: "",
        price: ""
        },
    ],
    });

    const[catform, setCatform] = useState({
        "category_name" : ""
    });

    const [categories, setCategories] = useState([]);
    const [catimages, setCatimages] = useState([]);
    const [images, setImages] = useState([]);
    const [categorySaved, setCategorySaved] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const category = ["T-Shirt", "Shirt", "Trousers", "Boxers", "FullSet"]

    const onCategoryChange = (e) => {
        const { name, value } = e.target;
        setCatform((f) => ({ ...f, [name]: value }));
    };

    const onChange = (e) => {
        const{name, value} = e.target;
        setForm((f) => ({ ...f, [name]:value }))
    }

    const onVariantChange = (index, e) => {
        const { name, value, type, checked } = e.target;

        setForm((f) => {
            const updated = [...f.variants];
            updated[index] = {
            ...updated[index],
            [name]: type === "checkbox" ? checked : value,
            };
            return { ...f, variants: updated };
        });
    };

    const addVariant = () => {
        setForm((f) => ({
            ...f,
            variants: [
            ...f.variants,
            { size: "", quantity: "", price: "" },
            ],
        }));
    };

    const removeVariant = (index) => {
        setForm((f) => ({
            ...f,
            variants: f.variants.filter((_, i) => i !== index),
        }));
    };


    const onImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        const filtered = files.filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
        setImages((prev) => [...prev, ...filtered].slice(0, 5));
        e.target.value = "";
    };

    const onCategoryImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        const filtered = files.filter((f) => f.type.startsWith("image/") && f.size <= 2 * 1024 * 1024);
        setCatimages((prev) => [...prev, ...filtered].slice(0, 1));
        e.target.value = "";
    };

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const removeCatimage = (idx) => {
        setCatimages((prev) => prev.filter((_, i) => i !== idx));
    };





    const onCatSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setCategorySaved(false);

    try{
        const requestBody = catimages.map(file =>({
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
    // only one image → take first key
    const imageObjectKey = urls[0].key;


    // Upload in parallel (or with a small concurrency cap)
    await Promise.all(catimages.map((file, i) =>
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

        const catData = {
            "categoryName" : catform.category_name,
            "categoryImageObjectKey" : imageObjectKey
        }
        
        const savecat = await fetch("http://localhost:8080/api/product/add-category",{
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(catData)
        })

        if(!savecat.ok){
            console.error("Presigning Failed", savecat.status, await savecat.text()); // 👈 see the real cause
            return;
        }
        setCategorySaved(true);
        fetchCategories();

        const result = savecat.json();
        console.log("Category Saved Successfully ✅");

    }
    catch(err){
        console.error("Error in onSubmit:", err)
    }

    }
    catch(err){
        console.error("Error in onSubmit:", err);
    }
    finally{
        setSubmitting(false);
    }
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
            categoryId: Number(form.categoryId),
            name: form.name,
            description: form.description,
            newArrival: form.newArrival,
            productImageObjectKey: imageKey,

            varients: form.variants.map(v => ({
                size: v.size,
                quantity: Number(v.quantity),
                price: Number(v.price)
            })),
        };

        
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



            <div className="flex items-start">

                <form onSubmit={onCatSubmit} className="w-[40%] max-w-2xl mx-auto bg-white/50 backdrop-blur mt-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)] rounded-2xl border border-gray-500 p-8 space-y-6">

                <div className="flex flex-col gap-2">
                    <label htmlFor="category_name" className="font-medium text-gray-900">Category Name</label>
                    <input type="text"
                        id="category_name"
                        name="category_name"
                        placeholder="Category Name"
                        value={catform.category_name}
                        onChange={onCategoryChange}
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label htmlFor="category_image" className="font-medium text-gray-900">Category Images</label>
                    <input
                        type="file"
                        id="category_image"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={onCategoryImagesChange}
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />

                    {catimages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-1">
                        {catimages.map((file, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeCatimage(idx)}
                                    className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-gray-900 shadow ring-1 ring-gray-200 hover:bg-white transition opacity-0 group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        </div>
                    )}

                    <p className="text-sm text-gray-500">Upload only 1 image, ≤ 5MB. JPG/PNG/WebP.</p>
                </div>

                <div className="pt-2 text-center">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-b from-gray-900 to-gray-700 text-white font-semibold shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60"
                    >
                        {submitting ? "Saving..." : "Save Category"}
                    </button>
                    {categorySaved && (
                        <p className="mt-3 text-green-700 font-medium">
                        Category saved successfully ✅
                        </p>
                    )}
                </div>
             </form>



             <form onSubmit={onSubmit} className="w-[60%] max-w-2xl mx-auto bg-white/50 backdrop-blur mt-8 shadow-[0_12px_30px_rgba(0,0,0,0.08)] rounded-2xl border border-gray-500 p-8 space-y-6">

                <div className="flex flex-col gap-2">
                    <label htmlFor="product_name" className="font-medium text-gray-900">Product Name</label>
                    <input type="text"
                        id="product_name"
                        name="name"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={onChange}
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />
                </div>

                 <div className="flex flex-col gap-2">
                    <label htmlFor="product_desc" className="font-medium text-gray-900">Product Description</label>
                    <input type="text"
                        id="product_desc"
                        name="description"
                        placeholder="Product Description"
                        value={form.description}
                        onChange={onChange}
                        required
                        className="border border-gray-300 rounded-xl p-3 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="product_category" className="font-medium text-gray-900">Product Category</label>
                   <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={onChange}
                        required
                        >
                        <option value="">-- Select Category --</option>

                        {categories.map(c => (
                            <option key={c.categoryId} value={c.categoryId}>
                            {c.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="lex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="newArrival"
                        checked={form.newArrival}
                        onChange={(e) =>
                        setForm(f => ({ ...f, newArrival: e.target.checked }))
                        }
                        className="w-5 h-5 accent-gray-900"
                    />
                    <span className="text-gray-800 font-medium">
                        Mark as New Arrival
                    </span>
                    </label>
                </div>

                {form.variants.map((v, idx) => (
                    <div
                        key={idx}
                        className="bg-white/70 border border-gray-300 rounded-xl p-5 space-y-4 shadow-sm"
                    >
                        <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">
                            Variant {idx + 1}
                        </h3>

                        {form.variants.length > 1 && (
                            <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="text-sm px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                            Remove
                            </button>
                        )}
                        </div>

                        {/* SIZE */}
                        <div className="flex flex-col gap-2">
                        <label className="font-medium text-gray-900">Size</label>
                        <select
                            name="size"
                            value={v.size}
                            onChange={(e) => onVariantChange(idx, e)}
                            required
                            className="border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
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

                        {/* PRICE + QUANTITY ROW */}
                        <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-900">Price</label>
                            <input
                            type="number"
                            step="0.01"
                            name="price"
                            placeholder="Price"
                            value={v.price}
                            onChange={(e) => onVariantChange(idx, e)}
                            required
                            className="border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-900">Quantity</label>
                            <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={v.quantity}
                            onChange={(e) => onVariantChange(idx, e)}
                            required
                            className="border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-900 transition"
                            />
                        </div>
                        </div>

                    </div>
                    ))}

                <button
                    type="button"
                    onClick={addVariant}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 transition"
                    >
                    + Add Another Variant
                </button>



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
        </div>
    );
}

