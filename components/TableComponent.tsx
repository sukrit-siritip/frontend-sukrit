import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import '@/styles.css';
import { Button, Divider } from "antd";
import { FileExcelTwoTone, RedoOutlined } from '@ant-design/icons';
import { Color } from "antd/es/color-picker";

interface ExcelViewerProps {
  filePath: string;
}

const TableComponent: React.FC<ExcelViewerProps & { searchValues: { technician: string, requestType: string, sapModule: string, customer: string } }> = ({ filePath, searchValues }) => {
  const [data, setData] = useState<string[][]>([]);
  const [filteredData, setFilteredData] = useState<string[][]>([]);
  const [position, setPosition] = useState<'start' | 'end'>('end');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
      setData(jsonData);
      setFilteredData(jsonData); // Initialize filtered data with all data
    };

    fetchData();
  }, [filePath]);

  useEffect(() => {
    // Filter data when search values change
    const newFilteredData = data.filter(row => {
      const { technician, requestType, sapModule, customer } = searchValues;

      const technicianIndex = 5; // Technician column index
      const requestTypeIndex = 4; // Request Type column index
      const sapModuleIndex = 3; // Module column index
      const customerIndex = 1; // Customer column index

      return (
        (technician === '' || row[technicianIndex].toLowerCase().includes(technician.toLowerCase())) &&
        (requestType === '' || row[requestTypeIndex].toLowerCase().includes(requestType.toLowerCase())) &&
        (sapModule === '' || row[sapModuleIndex].toLowerCase().includes(sapModule.toLowerCase())) &&
        (customer === '' || row[customerIndex].toLowerCase().includes(customer.toLowerCase()))
      );
    });

    setFilteredData(newFilteredData);
  }, [data, searchValues]);

  const exportToExcel = (dataToExport: string[][]) => {
    // Specify the column names
    const columnNames = ["Request ID", "Customer", "Subject", "Module", "Request Type", "Technician", "Evolution", "Last Update"];

    // Prepend column names as the first row
    const dataWithColumnNames = [columnNames];

    // Format the date in the "Last Update" column
    const dataToExportFormatted = dataToExport.map(row => {
      // Assuming "Last Update" is the 7th column
      const updatedRow = [...row];
      const dateValue = new Date((parseFloat(row[7]) - 25569) * 86400 * 1000);
      updatedRow[7] = dateValue.toLocaleDateString('en-GB'); // Format the date as "DD/MM/YYYY"
      return updatedRow;
    });

    // Add the formatted data to the array
    dataWithColumnNames.push(...dataToExportFormatted);

    const ws = XLSX.utils.aoa_to_sheet(dataWithColumnNames);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate the file name with "Ticket Evolution" and the export date
    const exportDate = new Date().toLocaleDateString('en-GB').split('/').join('_'); // Format: DD_MM_YYYY
    const fileName = `Ticket Evolution ${exportDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const refreshData = () => {
    setFilteredData(data); // Reset filteredData to the original data
  };

  return (
    <div className="excel-table-container">

<div className="excel-button-container">
      <Button type="primary" style={{ background: 'white', borderColor: "green" }} icon={<FileExcelTwoTone twoToneColor="green" />} iconPosition={position} onClick={() => exportToExcel(filteredData)}>
      <h3 style={{fontSize: 13, color: 'green', fontWeight: "lighter"}}>Export Excel</h3>
      </Button>
</div>

<div className="refresh-button-container">
      <Button icon={<RedoOutlined />} iconPosition={position} onClick={refreshData}>Refresh</Button>
      </div>
      <Divider />
      <h3 className='subheaderfontstyle'>Evolution</h3>
      <table className="excel-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Module</th>
            <th>Request Type</th>
            <th>Technician</th>
            <th>Evolution</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                // Convert Excel serial number to date for "Last Update" column
                if (cellIndex === 7) { // Assuming "Last Update" is the 7th column
                  // Convert the cell from string to number before performing arithmetic operations
                  const cellNumber = parseFloat(cell);
                  const date = new Date((cellNumber - 25569) * 86400 * 1000);
                  const formattedDate = date.toLocaleDateString('en-GB'); // Format the date as "DD/MM/YYYY"
                  return <td key={cellIndex} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{formattedDate}</td>;
                } else {
                  return <td key={cellIndex} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{cell}</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;