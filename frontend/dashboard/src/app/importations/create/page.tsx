'use client';

import CommonContainer from '@components/common-container';
import {
  IImportation,
  IProduct,
  ISupplier
} from '@constant/interface.constant';
import { Theme } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { HttpError, useForm, useList, useNotification } from '@refinedev/core';
import React from 'react';
import { transformVNMoney } from '@utils/transform.util';

type ImportationCreateProps = {
  onCancel: () => void;
  onSuccessfulCreate: (importationResponse: IImportation) => void;
};

type ImportItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

function getStyles(
  id: string,
  productsList: readonly IProduct[],
  theme: Theme
) {
  return {
    fontWeight: productsList.map((pr) => pr.product_id).includes(id)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular
  };
}

const ImportationCreate = ({
  onCancel,
  onSuccessfulCreate
}: ImportationCreateProps) => {
  const theme = useTheme();
  const {
    data: prodRecords,
    isLoading: proIsLoading,
    isError: proIsError
  } = useList<IProduct>({ resource: 'products' });

  const {
    data: supRecords,
    isLoading: supIsLoading,
    isError: supIsError
  } = useList<ISupplier>({ resource: 'supplier' });

  const [productsList, setProductList] = React.useState(
    prodRecords?.data || []
  );

  const [suppliersList, setSuppliersList] = React.useState(
    supRecords?.data || []
  );

  const { onFinish } = useForm<IImportation, HttpError>({
    resource: 'importations',
    action: 'create',
    redirect: false
  });

  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [remark, setRemark] = React.useState<string>('');
  const [supplier, setSupplier] = React.useState<ISupplier>();
  const [importItem, setImportItem] = React.useState<ImportItem[]>([]);

  React.useEffect(() => {
    setProducts([]);
  }, [productsList]);

  const totalPrice = React.useMemo(() => {
    return importItem.reduce((acc, item) => {
      return acc + item.unit_price * item.quantity;
    }, 0);
  }, [importItem]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event;

    const selectedProductIds = Array.isArray(value) ? value : [];

    const selectedProducts = productsList.filter(
      (product) =>
        product &&
        product.product_id &&
        selectedProductIds.includes(product.product_id)
    );

    setProducts(selectedProducts);
  };

  const { open } = useNotification();
  const onOpenNotification = React.useCallback(
    (
      type: 'success' | 'error' | 'progress',
      message: string,
      description: string
    ) => {
      open?.({
        type: type,
        message: message,
        description: description
      });
    },
    [open]
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = importItem.length === 0;

    importItem.forEach((item) => {
      if (item.unit_price <= 0 || item.quantity <= 0) {
        hasError = true;
        onOpenNotification(
          'error',
          'Invalid data for product',
          'Price and quantity must be greater than 0.'
        );
      }
    });

    if (hasError) {
      onOpenNotification(
        'error',
        'Invalid data for product',
        'Price and quantity must be greater than 0.'
      );
      return; // Prevent submission if there are errors
    }

    try {
      const importation = {
        total_price: totalPrice,
        import_items: importItem.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity
        })),
        supplier_id: supplier?.supplier_id
      };
      const response = await onFinish(importation);
      console.log('importation', response);
      if (response) {
        onSuccessfulCreate(response.data as IImportation);
        onOpenNotification(
          'success',
          'Importation created',
          'The importation has been created successfully.'
        );
        onCancel();
      } else {
        onOpenNotification(
          'error',
          'Importation not created',
          'The importation has not been created successfully.'
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  React.useEffect(() => {
    if (prodRecords?.data) {
      setProductList(prodRecords.data);
    }
  }, [prodRecords]);

  React.useEffect(() => {
    if (supRecords?.data) {
      setSuppliersList(supRecords.data);
    }
  }, [supRecords]);

  React.useEffect(() => {
    setImportItem(
      products
        .filter((pro) => pro?.product_id) // Safeguard against undefined objects
        .map((product) => ({
          product_id: product.product_id || '',
          product_name: product.product_name || 'Unknown',
          quantity: 0,
          unit_price: 0,
          total_price: 0
        }))
    );
  }, [products]);

  if (proIsError || supIsError) {
    return <div>Error</div>;
  }

  if (proIsLoading || supIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CommonContainer
      isModal
      className="pt-8 pe-4 ps-8 flex flex-col gap-4 shadow-sm h-max max-h-max overflow-hidden overflow-y-scroll"
      heightMax={false}
      heightMin={false}
    >
      <Typography variant="h3" className="text-3xl font-semibold self-center">
        Importation
      </Typography>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-7 mt-4 min-h-[80%] h-auto"
      >
        <Stack className="gap-3 col-span-3 border-r-[1px] me-4 border-solid border-accent border-opacity-20 pr-8 ">
          <Typography variant="h3" className="text-lg font-bold">
            Total Price: {transformVNMoney(totalPrice)}
          </Typography>

          <Box className="flex flex-row items-center gap-4 py-2">
            <Typography variant="h3" className="text-lg font-bold">
              Supply Information
            </Typography>
          </Box>

          <FormLabel className="grid grid-cols-4 items-center">
            <Typography variant="h6" className="text-accent text-base">
              ID:
            </Typography>
            <Typography variant="h6" className="text-accent text-base">
              {supplier?.supplier_id}
            </Typography>
          </FormLabel>

          <FormControl size="small">
            <FormLabel className="grid grid-cols-4 items-center">
              <Typography variant="h6" className="text-accent text-base">
                Name:
              </Typography>
              <Select
                className="rounded-lg p-2 col-span-3 text-base"
                value={supplier?.supplier_id || ''} // Ensure value matches the MenuItem value
                onChange={(e) =>
                  setSupplier(() =>
                    suppliersList.find(
                      (sup: ISupplier) =>
                        sup.supplier_id === Number(e.target.value)
                    )
                  )
                }
              >
                {suppliersList.map((supplier: ISupplier) => (
                  <MenuItem
                    key={supplier.supplier_id}
                    value={supplier.supplier_id}
                  >
                    {supplier.supplier_name}
                  </MenuItem>
                ))}
              </Select>
            </FormLabel>
          </FormControl>
          <FormControl size="small">
            <FormLabel className="grid grid-cols-4 items-center">
              <Typography variant="h6" className="text-accent text-base">
                Remarks:
              </Typography>
              <Input
                type="text"
                multiline
                disableUnderline
                rows={5}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="border border-accent rounded-lg p-2 col-span-3 text-base"
              />
            </FormLabel>
          </FormControl>
        </Stack>
        <Stack className="gap-1 col-span-4">
          <Box className=" px-3 flex flex-col justify-betweenitems-center py-2">
            <Typography variant="h3" className="  text-lg font-bold">
              Items Information
            </Typography>
            <FormControl
              className="grid grid-cols-5 gap-2 w-full items-center"
              sx={{
                m: 1,
                width: 300,
                mt: 3
              }}
            >
              <Typography className="col-span-2">Choose Products: </Typography>
              <Select
                className="col-span-3"
                multiple
                displayEmpty
                defaultValue={[]}
                value={products
                  .map((prod) => prod?.product_id)
                  .filter((id): id is string => id !== undefined)}
                onChange={handleChange}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Please choose one</em>;
                  }

                  // Display product names
                  return selected
                    .map(
                      (productId) =>
                        productsList.find(
                          (prod) => prod.product_id === productId
                        )?.product_name
                    )
                    .join(', ');
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem disabled value="">
                  <em>Please choose one</em>
                </MenuItem>
                {productsList.map((prod) => (
                  <MenuItem
                    key={prod.product_id}
                    value={prod.product_id}
                    style={getStyles(
                      prod.product_id || '',
                      productsList,
                      theme
                    )}
                  >
                    {prod.product_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {importItem.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    setProducts((prev) => {
                      const newProducts = [...prev];
                      newProducts.splice(index, 1);
                      return newProducts;
                    });
                  }}
                >
                  <Delete />
                </IconButton>
              }
            >
              <Box className="grid grid-cols-3 gap-2">
                <ListItemText
                  primary={
                    <Typography variant="h6" className="text-accent text-base">
                      {item.product_name}
                    </Typography>
                  }
                />
                <FormControl size="small">
                  <TextField
                    id="unit-price"
                    type="number"
                    defaultValue={''}
                    value={item.unit_price}
                    variant="outlined"
                    label="Unit Price"
                    aria-describedby="Unit Price"
                    placeholder="10"
                    onChange={(e) => {
                      if (Number(e.target.value) <= 0) return;
                      setImportItem((prev) => {
                        const newItems = [...prev];
                        newItems[index].unit_price = Number(e.target.value);
                        return newItems;
                      });
                    }}
                  />
                </FormControl>
                <FormControl size="small">
                  <TextField
                    id="stock-quanity"
                    type="number"
                    defaultValue={''}
                    value={item.quantity}
                    variant="outlined"
                    label="Stock Quantity"
                    aria-describedby="Stock Quantity"
                    placeholder="10"
                    onChange={(e) => {
                      if (Number(e.target.value) <= 0) return;
                      setImportItem((prev) => {
                        const newItems = [...prev];
                        newItems[index].quantity = Number(e.target.value);
                        return newItems;
                      });
                    }}
                  />
                </FormControl>
              </Box>
            </ListItem>
          ))}
        </Stack>
        <Box className="flex flex-grow gap-4 max-h-max col-span-full items-end justify-end mt-4">
          <Button
            className="bg-accent text-secondary-100 font-bold py-4 px-16 "
            type="submit"
          >
            Save
          </Button>
          <Button
            className="border-accent border-solid border-2 text-accent py-4 px-8 text-base font-bold min-w-max max-h-max"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </CommonContainer>
  );
};

export default ImportationCreate;
