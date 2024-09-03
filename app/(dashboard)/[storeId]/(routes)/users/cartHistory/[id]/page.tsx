import { connectToDb } from "@/lib/mongoose";
import { User, Product, Image as ImageModel } from "@/models";
import Image from "next/image";

const CartHistoryPage = async ({
  params,
}: {
  params: { storeId: string; id: string };
}) => {
  await connectToDb();

  const user = await User.findOne({
    storeId: params.storeId,
    _id: params.id,
  }).select("cart name email");

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
      </div>
    );
  }

  const cartDetails = await Promise.all(
    user.cart.map(async (cartItem: any) => {
      const product = await Product.findById(cartItem.product).select(
        "name fakePrice"
      );
      const images = await ImageModel.find({
        productId: cartItem.product,
      }).select("url");

      return {
        productId: cartItem.product.toString(),
        quantity: cartItem.quantity,
        flavor: cartItem.flavor,
        size: cartItem.size,
        price: cartItem.price, // Use the price directly from the cart item
        productName: product ? product.name : "Unknown Product",
        fakePrice: product ? product.fakePrice : 0,
        images: images.map((img) => img.url),
      };
    })
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart History for {user.name}</h1>
      <p className="mb-8">Email: {user.email}</p>

      {cartDetails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartDetails.map((item, index) => (
            <div key={index} className="border rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold">{item.productName}</h2>
              <p className="text-gray-600">
                Price: ₹{item.price}{" "}
                <span className="line-through text-red-500">
                  ₹{item.fakePrice}
                </span>
              </p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Flavor: {item.flavor}</p>
              <p className="text-gray-600">Size: {item.size}</p>
              <div className="flex gap-2 mt-4">
                {item.images.map((imageUrl: any, idx: any) => (
                  <Image
                    key={idx}
                    src={imageUrl}
                    alt={`${item.productName} image`}
                    width={96}
                    height={96}
                    className="object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No items in the cart history.</p>
      )}
    </div>
  );
};

export default CartHistoryPage;
