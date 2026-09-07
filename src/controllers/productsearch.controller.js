import {asyncHandler} from '../utils/asyncHandler.js'
import {apiresponse} from '../utils/Apiresponse.js'
import {apierror} from '../utils/Apierror.js'
import {Product} from '../models/product.models.js'

const searchproduct=asyncHandler(async(req,res)=>{
    const {search,category,minprice,maxprice,sortby}=req.query

    const filter={
        isActive:true  // only fetch active products  or default filter to fetch only active products
    }
    //search by name
    if(search){
        filter.name={
            $regex:search,  // search for products whose name contains the search string(get matching products)
            $options:"i" //  make search case insensitive
        }
    }
    //category filter
    if(category){
        filter.category=category
    }
    //price filter
    if(minprice && maxprice){
        filter.price={
            $gte:minprice,
            $lte:maxprice
        }
    }else if(minprice){
        filter.price={
            $gte:minprice
        }
    }else if(maxprice){
        filter.price={
            $lte:maxprice
        }
    }
    //sort by filter
    let sort={createdAt:-1} // default sort by newest or sort by createdAt in descending order
    if(sortby){
        if(sortby==="priceasc"){
            sort.price=1
        }
        else if(sortby==="pricedesc"){
            sort.price=-1
        }
        else if(sortby==="newest"){
            sort.createdAt=-1
        }
        else if(sortby==="oldest"){
            sort.createdAt=1
        }
        else if(sortby===ratingsdec){
            sort.rating=-1
        }
    }
    const products=await Product.find(filter).populate("category").sort(sort) // populate category field with category details and sort products based on sort object and filter products based on filter object
    if(!products.length) throw new apierror(404,"no products found")
    return res.status(200).json(new apiresponse(200,products,"products fetched successfully")
    )
})
export {searchproduct}