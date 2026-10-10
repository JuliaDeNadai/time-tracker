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
    const showValues = filter.showValues === true
    const currencyFormat = '"R$"#,##0.00;[Red]\-"R$"#,##0.00'
    const totalStyle = { bold: true, color: { argb: 'FF006400' } }

    const withValue = (cells: any[], value: any) => showValues ? [...cells, value] : cells

    const addTotalRow = (hours: number, amount: number) => {
      const totalRow = sheet.addRow(withValue(['', 'Total', '', '', '', new String(this.formatHours(hours))], amount));
      totalRow.eachCell((cell) => {
        cell.font = totalStyle; 
      });
      if (showValues) totalRow.getCell(7).numFmt = currencyFormat;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Relatorio - ${filter.month}_${filter.year} - ${filter.email}`);
    
    sheet.addRow([`${filter.month}/${filter.year} - ${filter.name ?? ''}`]); 
    sheet.addRow(['', '', '', '', '', '']);
    const cabecalho = sheet.addRow(withValue(['','Empresa', 'Serviço', 'Início', 'Fim', 'Total/Horas'], 'Valor Total'));
    cabecalho.eachCell((cell) => {
      cell.font = totalStyle; 
    });

    let totalAmount = 0, totalHour = 0
    let prevCompany = ''
    for (const [index, item] of data.entries()) {
      const companyId = item.company?._id?.toString() ?? ''

      if(index > 0 && prevCompany !== companyId){
        addTotalRow(totalHour, totalAmount)
        sheet.addRow(['','', '', '', '', '', '']);
        totalAmount = 0
        totalHour = 0
      }

      const amount = parseFloat(item.total_amount) || 0
      const hours = parseFloat(item.total_hours) || 0
      totalAmount += amount
      totalHour += hours

      let row = sheet.addRow(withValue([
        '', 
        item.company?.name ?? '', 
        item.service?.name ?? '', 
        new Date(item.clock_in).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), 
        item.clock_out ? new Date(item.clock_out).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'Em aberto', 
        new String(this.formatHours(hours)), 
      ], amount));
      
      row.getCell(3).numFmt = 'dd/mm/yyyy hh:mm';
      row.getCell(4).numFmt = 'dd/mm/yyyy hh:mm';
      if (showValues) row.getCell(7).numFmt = currencyFormat;

      prevCompany = companyId
    }

    addTotalRow(totalHour, totalAmount)

    // Ajustar largura das colunas
    sheet.columns = [
      { width: 20 }, // Empresa
      { width: 20 }, // Serviço
      { width: 15 }, // Início
      { width: 15 }, // Fim
      { width: 15 }, // Total/Horas
      ...(showValues ? [{ width: 15 }] : []), // Valor Total
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