import { useAuth } from "@/hooks/useAuth";
import {
  Button,
  Image,
  Modal,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconShoppingCart, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { AuthForm } from "../Auth/AuthForm";
import { getCartStore } from "@/store/useCartStore";

import { notifications } from "@mantine/notifications";

export const CategoryTable = ({ fetchedResult, selectedSizes, data }: any) => {
  const name = data?.handle;
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";

  const router = useRouter();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  const goToCartPage = (item: any) => {
    router.push(`/product-details?id=${item?.id}&name=${name}`);
  };

  const addProductToCart = (element: any, quantity: number = 1) => {
    addToCart({
      product: {
        productType: "stone",
        productId: element.id,
        collection_slug: element.collection_slug,
        color: element.color,
        ct_weight: element.ct_weight,
        cut: element.cut,
        image_url: element.image_url,
        price: element.price,
        quality: element.quality,
        shape: element.shape,
        size: element.size,
        type: element.type,
      },
      quantity,
    });

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Product Added To The Cart!",
      position: "top-right",
      autoClose: 4000,
    });
  };

  const filteredRows = fetchedResult
    .filter(
      (item: any) =>
        selectedSizes.length === 0 || selectedSizes.includes(item.size)
    )
    .map((element: any) => (
      <TableTr
        key={element.id}
        onClick={() => goToCartPage(element)}
        className="hover:bg-gray-300 cursor-pointer"
      >
        <TableTd>
          <Image src={element?.image_url} h="50" w="50" />
        </TableTd>
        <TableTd>{element.type}</TableTd>
        <TableTd>{element.collection_slug}</TableTd>
        <TableTd>{element.color}</TableTd>
        <TableTd>{element.size}</TableTd>
        <TableTd>{element.ct_weight}</TableTd>
        <TableTd>{element.quality}</TableTd>
        <TableTd>{element.cut}</TableTd>
        <TableTd></TableTd>
        <TableTd>
          {user ? (
            <Button
              leftSection={<IconShoppingCart />}
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                addProductToCart(element);
              }}
              color="#0b182d"
            >
              ADD TO CART
            </Button>
          ) : (
            <Button
              className="p-3"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              leftSection={<IconUser />}
              color="gray"
            >
              SIGN IN TO ORDER
            </Button>
          )}
        </TableTd>
      </TableTr>
    ));

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{
          style: {
            backdropFilter: "blur(4px)",
          },
        }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>

      <hr className="mt-11 text-gray-300" />
      <div className="mt-10 px-44 mb-44">
        <p className="text-right text-sm text-gray-600 mb-2">
          Showing {filteredRows.length} result
          {filteredRows.length !== 1 ? "s" : ""}
        </p>
        <Table
          highlightOnHover
          highlightOnHoverColor="#DCDCDC"
          striped
          stickyHeaderOffset={60}
        >
          <TableThead>
            <TableTr className="font-extrabold text-[18px] text-gray-700">
              <TableTh>Image</TableTh>
              <TableTh>Type</TableTh>
              <TableTh>Gemstone</TableTh>
              <TableTh>Color</TableTh>
              <TableTh>Size</TableTh>
              <TableTh>CT Weight</TableTh>
              <TableTh>Quality</TableTh>
              <TableTh>Cut</TableTh>
              <TableTh>Estimated Price</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>{filteredRows}</TableTbody>
        </Table>
      </div>
    </>
  );
};
