import { Injectable } from "@nestjs/common";
import * as ExcelJS from 'exceljs';
import { writeFileSync } from 'fs';


@Injectable()
export class ReportsService {

  async gererateTimeEntriesReport(data: any){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Relatorio - 08_2025 - Adebrail');
    
    sheet.addRow([`08/2025 - ${data[0].user.name}`]); 


    sheet.addRow(['Empresa', 'Serviço', 'Início', 'Fim', 'Total/Horas', 'Valor Total']);

    let totalAmount = 0, totalHour = 0
    for (const item of data) {
      totalAmount += parseFloat(item.total_amount)
      totalHour += parseFloat(item.total_hours)
      let row = sheet.addRow([item.company.name, item.service.name, item.clock_in, item.clock_out, parseFloat(item.total_hours), parseFloat(item.total_amount)]);
      
      row.getCell(3).numFmt = 'dd/mm/yyyy hh:mm';
      row.getCell(4).numFmt = 'dd/mm/yyyy hh:mm';
    }

    const totalRow = sheet.addRow(['Total', '', '', '', totalHour, totalAmount]);
    totalRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FF006400' } }; // negrito e verde escuro
    });

    // Ajustar largura das colunas
    sheet.columns = [
      { width: 20 }, // Empresa
      { width: 20 }, // Serviço
      { width: 15 }, // Início
      { width: 15 }, // Fim
      { width: 15 }, // Total/Horas
      { width: 15 }, // Valor Total
    ];

    return await workbook.xlsx.writeBuffer();
  }

  parseDateTime(str: string): Date {
    const [datePart, timePart] = str.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
}