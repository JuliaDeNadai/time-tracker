import { Injectable } from "@nestjs/common";
import * as ExcelJS from 'exceljs';
import { writeFileSync } from 'fs';
import { TimeEntry } from "../time-entries/time-entries.schema";


@Injectable()
export class ReportsService {

  formatHours(total: number){
    const totalHourDecimal = total; // ex: 5.5
    const hours = Math.floor(totalHourDecimal);
    const minutes = Math.round((totalHourDecimal - hours) * 60);

    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
  }

  async generateTimeEntriesReport(data: TimeEntry[], filter: any){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Relatorio - ${filter.month}_${filter.year} - ${filter.email}`);
    
    sheet.addRow([`${filter.month}/${filter.year} - ${data[0].user.name}`]); 
    sheet.addRow(['', '', '', '', '', '']);
    const cabecalho = sheet.addRow(['','Empresa', 'Serviço', 'Início', 'Fim', 'Total/Horas', 'Valor Total']);
    cabecalho.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FF006400' } }; 
    });

    let totalAmount = 0, totalHour = 0
    let prevCompany = ''
    for (const [index, item] of data.entries()) {

      if(index > 0 && prevCompany !== item.company._id){

        let formattedHours = this.formatHours(totalHour)
        const totalRow = sheet.addRow(['','Total', '', '', '', new String(formattedHours), totalAmount]);
        totalRow.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FF006400' } }; 
        });
        totalRow.getCell(7).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';
        sheet.addRow(['','', '', '', '', '', '']);
        totalAmount = 0
        totalHour = 0
      }

      totalAmount += parseFloat(item.total_amount)
      totalHour += parseFloat(item.total_hours)

      let formattedHour = this.formatHours(parseFloat(item.total_hours))
      let row = sheet.addRow([
        '', 
        item.company.name, 
        item.service.name, 
        new Date(item.clock_in).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), 
        new Date(item.clock_out).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), 
        new String(formattedHour), 
        parseFloat(item.total_amount)
      ]);
      
      row.getCell(3).numFmt = 'dd/mm/yyyy hh:mm';
      row.getCell(4).numFmt = 'dd/mm/yyyy hh:mm';
      row.getCell(7).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';

      prevCompany = item.company._id as string
    }

    let formattedHours = this.formatHours(totalHour)
    const totalRow = sheet.addRow(['', 'Total', '', '', '', new String(formattedHours), totalAmount]);
    totalRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FF006400' } }; 
    });
    totalRow.getCell(7).numFmt = '"R$"#,##0.00;[Red]\-"R$"#,##0.00';

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