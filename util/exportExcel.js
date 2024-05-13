const ExcelJS = require('exceljs');
/**
 * @description: 导出excel文件
 * @param {*} fileHeader  导出的表头
 * @param {*} data 导出的数据
 * @param {*} ctx 上下文对象
 * @return {*}
 */
async function exportExcel(fileHeader, data, ctx) {
	let sum = 0;
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet();
	sheet.columns = fileHeader.map((item, index) => {
		return {
			header: item.header,
			key: item.key,
			width: item.width || 25,
		}
	})
	data.forEach((item, index) => {
		sheet.addRow(item);
		sum += item.price * item.total;
	})
	sheet.getColumn(3).numFmt = '￥#,##0.00';
	sheet.getColumn(4).numFmt = '￥#,##0.00';
	sheet.getColumn(5).numFmt = '￥#,##0.00';
	sheet.getColumn(5).header = '本单总价';
	sheet.getColumn(5).width = 25;
	const totalPrice = sheet.getCell('E2');
	totalPrice.value = sum;
	// 生成Excel文件
	const buffer = await workbook.xlsx.writeBuffer();

	ctx.status = 200;
	ctx.set('Content-Type', 'application/vnd.openxmlformats');
	ctx.attachment('example.xlsx');
	ctx.body = buffer;

}

module.exports = exportExcel;