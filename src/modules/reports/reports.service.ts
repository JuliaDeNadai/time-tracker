import { Injectable } from "@nestjs/common";
import * as ExcelJS from 'exceljs';
import { TimeEntry } from "../time-entries/time-entries.schema";

const TIMEZONE = 'America/Sao_Paulo'
const weekdayFormat = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: TIMEZONE })
const isoDateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE })

@Injectable()
export class ReportsService {

  formatHours(total: number){
    const totalHourDecimal = total; // ex: 5.5
    const hours = Math.floor(totalHourDecimal);
    const minutes = Math.round((totalHourDecimal - hours) * 60);

    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
  }

  getNationalHolidays(year: number): Set<string> {
    const pad = (n: number) => n.toString().padStart(2, '0')
    const toKey = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`

    // Páscoa pelo algoritmo de Meeus/Jones/Butcher
    const a = year % 19, b = Math.floor(year / 100), c = year % 100
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const easter = Date.UTC(year, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1)
    const fromEaster = (days: number) => toKey(new Date(easter + days * 86_400_000))

    return new Set([
      `${year}-01-01`, `${year}-04-21`, `${year}-05-01`, `${year}-09-07`, `${year}-10-12`,
      `${year}-11-02`, `${year}-11-15`, `${year}-11-20`, `${year}-12-25`,
      fromEaster(-48), fromEaster(-47), // Carnaval
      fromEaster(-2),                   // Sexta-feira Santa
      fromEaster(60),                   // Corpus Christi
    ])
  }

  async generateTimeEntriesReport(data: TimeEntry[], filter: any){
    const showValues = filter.showValues === true
    const currencyFormat = '"R$"#,##0.00;[Red]\-"R$"#,##0.00'
    const totalStyle = { bold: true, color: { argb: 'FF006400' } }
    const nonWorkingDayFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8D7DA' } }
    const valueCol = 9

    const withValue = (cells: any[], value: any) => showValues ? [...cells, value] : cells

    const holidaysByYear = new Map<number, Set<string>>()
    const isNonWorkingDay = (date: Date, weekday: string) => {
      if (weekday === 'sábado' || weekday === 'domingo') return true
      const isoDate = isoDateFormat.format(date)
      const year = Number(isoDate.slice(0, 4))
      if (!holidaysByYear.has(year)) holidaysByYear.set(year, this.getNationalHolidays(year))
      return holidaysByYear.get(year)!.has(isoDate)
    }

    const addTotalRow = (hours: number, amount: number) => {
      const totalRow = sheet.addRow(withValue(['', 'Total', '', '', '', '', '', new String(this.formatHours(hours))], amount));
      totalRow.eachCell((cell) => {
        cell.font = totalStyle; 
      });
      if (showValues) totalRow.getCell(valueCol).numFmt = currencyFormat;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Relatorio - ${filter.month}_${filter.year} - ${filter.email}`);
    
    sheet.addRow([`${filter.month}/${filter.year} - ${filter.name ?? ''}`]); 
    sheet.addRow([]);
    const cabecalho = sheet.addRow(withValue(['', 'Empresa', 'Serviço', 'Descrição', 'Dia', 'Início', 'Fim', 'Total/Horas'], 'Valor Total'));
    cabecalho.eachCell((cell) => {
      cell.font = totalStyle; 
    });

    let totalAmount = 0, totalHour = 0
    let prevCompany = ''
    for (const [index, item] of data.entries()) {
      const companyId = item.company?._id?.toString() ?? ''

      if(index > 0 && prevCompany !== companyId){
        addTotalRow(totalHour, totalAmount)
        sheet.addRow([]);
        totalAmount = 0
        totalHour = 0
      }

      const amount = parseFloat(item.total_amount) || 0
      const hours = parseFloat(item.total_hours) || 0
      totalAmount += amount
      totalHour += hours

      const clockIn = new Date(item.clock_in)
      const weekday = weekdayFormat.format(clockIn)

      const row = sheet.addRow(withValue([
        '', 
        item.company?.name ?? '', 
        item.service?.name ?? '', 
        item.details ?? '',
        weekday.charAt(0).toUpperCase() + weekday.slice(1),
        clockIn.toLocaleString('pt-BR', { timeZone: TIMEZONE }), 
        item.clock_out ? new Date(item.clock_out).toLocaleString('pt-BR', { timeZone: TIMEZONE }) : 'Em aberto', 
        new String(this.formatHours(hours)), 
      ], amount));
      
      row.getCell(4).alignment = { wrapText: true, vertical: 'top' };
      if (isNonWorkingDay(clockIn, weekday)) row.getCell(5).fill = nonWorkingDayFill;
      if (showValues) row.getCell(valueCol).numFmt = currencyFormat;

      prevCompany = companyId
    }

    addTotalRow(totalHour, totalAmount)

    sheet.columns = [
      { width: 2 },  // margem
      { width: 20 }, // Empresa
      { width: 20 }, // Serviço
      { width: 40 }, // Descrição
      { width: 15 }, // Dia
      { width: 18 }, // Início
      { width: 18 }, // Fim
      { width: 12 }, // Total/Horas
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
