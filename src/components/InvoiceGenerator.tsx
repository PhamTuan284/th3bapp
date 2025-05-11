import React, { useState } from 'react';
import { Button, Box, TextField } from '@mui/material';
import * as XLSX from 'xlsx';
import type { ClothingItem } from '../types';

interface InvoiceGeneratorProps {
  items: ClothingItem[];
}

const SIZES = ['M', 'L', 'XL']; // You can adjust this if needed

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ items }) => {
  const [orderNumber, setOrderNumber] = useState('');

  const generateInvoice = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '-');

    // --- SHEET 1: Invoice ---
    const aoa: unknown[][] = [];
    aoa.push([
      '', '', '', '', '', '', '', '', '', '', ''
    ]);
    aoa.push([
      '', '', '', `Xuất hàng HTOP - Đơn ${orderNumber || ''} (${dateStr})`, '', '', '', '', '', '', ''
    ]);
    aoa.push([
      'STT', 'Mã', 'Màu', 'Mô tả', 'Size', 'Số lượng xuất', 'Đơn giá', 'Thành tiền', 'Số lượng tồn kho', 'Ghi chú', 'Image']
    );

    let stt = 1;
    let totalExported = 0;
    let totalValue = 0;
    let totalStock = 0;

    items.forEach((item) => {
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
    });

    aoa.push([
      '', '', '', 'Tổng', '', totalExported, '', totalValue, totalStock, '', ''
    ]);

    const worksheet1 = XLSX.utils.aoa_to_sheet(aoa);
    worksheet1['!cols'] = [
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

    // --- SHEET 2: Kho HTOP ---
    const khoAoa: unknown[][] = [];
    khoAoa.push([
      '', '', '', '', '', '', '', '', ''
    ]);
    khoAoa.push([
      '', '', '', 'Kho HTOP', '', '', '', '', ''
    ]);
    khoAoa.push([
      'STT', 'Mã', 'Màu', 'Mô tả', 'Size', 'Số lượng', 'Đơn giá', 'Mô tả']
    );

    let khoStt = 1;
    items.forEach((item) => {
      SIZES.forEach((size) => {
        const qty = item.sizes[size] || 0;
        khoAoa.push([
          khoStt,
          item.name,
          item.category,
          item.image && item.image.startsWith('http') ? item.image : 'Image in app',
          size,
          qty,
          item.price,
          item.description || '', // detailed description
        ]);
        khoStt++;
      });
    });

    const worksheet2 = XLSX.utils.aoa_to_sheet(khoAoa);
    worksheet2['!cols'] = [
      { wch: 5 }, // STT
      { wch: 10 }, // Mã
      { wch: 15 }, // Màu
      { wch: 40 }, // Mô tả (image)
      { wch: 8 }, // Size
      { wch: 15 }, // Số lượng
      { wch: 15 }, // Đơn giá
      { wch: 50 }, // Mô tả (description)
    ];

    // --- Workbook ---
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'Xuất hàng');
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'Kho HTOP');

    const fileName = `Xuất hàng HTOP - Đơn ${orderNumber || ''} (${dateStr}).xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Box sx={{ mt: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
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
  );
};

export default InvoiceGenerator; 