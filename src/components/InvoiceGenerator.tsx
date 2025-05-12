import React, { useState } from 'react';
import { Button, Box, TextField, Checkbox, FormControlLabel } from '@mui/material';
import * as XLSX from 'xlsx';
import type { ClothingItem } from '../types';

interface InvoiceGeneratorProps {
  items: ClothingItem[];
}

const SIZES = ['M', 'L', 'XL']; // You can adjust this if needed

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ items }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const generateInvoice = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '-');

    const workbook = XLSX.utils.book_new();

    // If no items are selected, use all items
    const itemsToExport = selectedItems.size > 0
      ? items.filter(item => selectedItems.has(item.id))
      : items;

    itemsToExport.forEach((item, index) => {
      // Create a sheet for each selected item
      const aoa: unknown[][] = [];
      aoa.push([
        '', '', '', '', '', '', '', '', '', '', ''
      ]);
      aoa.push([
        '', '', '', `Xuất hàng HTOP - Đơn ${orderNumber || ''} (${dateStr}) - ${item.name}`, '', '', '', '', '', '', ''
      ]);
      aoa.push([
        'STT', 'Mã', 'Màu', 'Mô tả', 'Size', 'Số lượng xuất', 'Đơn giá', 'Thành tiền', 'Số lượng tồn kho', 'Ghi chú', 'Image']
      );

      let stt = 1;
      let totalExported = 0;
      let totalValue = 0;
      let totalStock = 0;

      SIZES.forEach((size) => {
        const exportedQty = item.sizes[size] || 0;
        const stockQty = 0; // You can add stock quantity if you have it
        const value = exportedQty * item.price;
        totalExported += exportedQty;
        totalValue += value;
        totalStock += stockQty;
        aoa.push([
          stt,
          item.name,
          item.category,
          item.description,
          size,
          exportedQty,
          item.price,
          value,
          stockQty,
          item.note || '',
          item.image && item.image.startsWith('http') ? item.image : 'Image in app',
        ]);
        stt++;
      });

      aoa.push([
        '', '', '', 'Tổng', '', totalExported, '', totalValue, totalStock, '', ''
      ]);

      const worksheet = XLSX.utils.aoa_to_sheet(aoa);
      worksheet['!cols'] = [
        { wch: 5 }, // STT
        { wch: 10 }, // Mã
        { wch: 15 }, // Màu
        { wch: 40 }, // Mô tả
        { wch: 8 }, // Size
        { wch: 15 }, // Số lượng xuất
        { wch: 15 }, // Đơn giá
        { wch: 20 }, // Thành tiền
        { wch: 18 }, // Số lượng tồn kho
        { wch: 20 }, // Ghi chú
        { wch: 40 }, // Image (URL/base64)
      ];

      // Add the sheet to the workbook with a unique name
      const sheetName = `Invoice_${index + 1}_${item.name.substring(0, 20)}`;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    const fileName = `Xuất hàng HTOP - Đơn ${orderNumber || ''} (${dateStr}).xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <TextField
          label="Số đơn (Order Number)"
          size="small"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)}
          sx={{ minWidth: 180 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={generateInvoice}
          disabled={items.length === 0}
        >
          Xuất hóa đơn Excel
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {items.map((item) => (
          <FormControlLabel
            key={item.id}
            control={
              <Checkbox
                checked={selectedItems.has(item.id)}
                onChange={() => handleItemSelection(item.id)}
              />
            }
            label={item.name}
          />
        ))}
      </Box>
    </Box>
  );
};

export default InvoiceGenerator; 