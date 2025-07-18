"use client";
import { Card } from "@mantine/core";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { addProductToCart } from "@/utils/commonFunctions";

export const JewelryCategoryCard = ({
  isBead,
  category,
  product,
  index,
}: any) => {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);
  const redirectToProduct = (product: any) => {
    const handle = product?.node?.handle;

    isBead
      ? router?.push(`/jewerly/beads/${handle}`)
      : router?.push(`/jewerly/${category}/${handle}`);
  };

  const addProduct = async () => {
    await addProductToCart(product?.node, 1, addToCart);

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Jewelry product added to the cart!",
      position: "top-right",
      autoClose: 4000,
    });
  };

  return (
    <Card
      withBorder
      padding="lg"
      className="flex flex-col justify-start h-[450px] bg-white cursor-pointer"
      onClick={() => redirectToProduct(product)}
    >
      <div
        className="w-full h-[300px] flex items-center justify-center overflow-hidden relative"
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="absolute top-3 left-3 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-sm z-10">
          On Sale
        </div>

        <motion.img
          key="main"
          src={product?.node?.images?.edges?.[0]?.node?.url}
          alt={product?.node?.title}
          className={`absolute ${isBead ? "object-fill" : "object-contain"}`}
          style={{ height: 300, width: "100%" }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: hovered === index ? 0 : 1,
            scale: 1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {product?.node?.images?.edges?.[1]?.node?.url && (
          <motion.img
            key="hover"
            src={product?.node?.images?.edges?.[1]?.node?.url}
            alt={product?.node?.title}
            className="absolute"
            style={{ height: 300, width: "100%" }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: hovered === index ? 1 : 0,
              scale: hovered === index ? 1 : 1.1,
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        )}
      </div>

      <div className="mt-4 h-[48px]">
        <span className="text-gray-700 text-[1.2rem] block line-clamp-1 leading-snug">
          {product?.node?.title}
        </span>
      </div>

      <div className="mt-2.5 text-[1.2rem] flex items-center gap-3">
        <span className="font-semibold">
          $ {product?.node?.variants?.edges[0]?.node?.price?.amount} USD
        </span>
        <span className="text-[1.2rem] line-through text-gray-500">
          $
          {Number(product?.node?.variants?.edges[0]?.node?.price?.amount) +
            2000}{" "}
          USD
        </span>
      </div>
      <div className="mt-2">
        <motion.button
          className="relative text-gray-500 text-sm px-0 py-1 border-none bg-transparent focus:outline-none cursor-pointer"
          initial="rest"
          whileHover="hover"
          animate="rest"
          onClick={(e) => {
            e.stopPropagation();
            addProduct();
          }}
        >
          Add To Cart
          <motion.span
            variants={{
              rest: { width: "0%" },
              hover: { width: "100%" },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-0 bottom-0 h-[1.5px] bg-gray-500"
          />
        </motion.button>
      </div>
    </Card>
  );
};
