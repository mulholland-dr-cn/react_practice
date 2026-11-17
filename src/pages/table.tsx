import { useEffect, useState } from "react"

interface Employee {
    id: number
    name: string
    age: number
    department: string
    salary: number
}
const Table = (): React.JSX.Element => {
    const [editProp, setEditProp] = useState<{ editCell: undefined | string, editing: boolean, editVal: undefined | string | number }>({ editing: false, editCell: undefined, editVal: undefined });
    const columns: (keyof Employee)[] = ['id', 'age', 'department', 'name', 'salary'];
    const [tableData, setTableData] = useState([{ id: 1, name: 'xx', age: 12, department: 'zz', salary: 121 }, { id: 2, name: '232sxf', age: 23, department: 'ggga', salary: 121 }]); // it is original data , can be changed by modify , delete, add.
    const [filteredTableData, setFilteredTableData] = useState<Employee[]>(tableData); // it is the data after searching
    useEffect(() => {
        setFilteredTableData(tableData);
    }, [tableData]) // after modify original data , need to update filter data , because filter data is for render
    return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: `100svh` }}>
        <div style={{ display: "flex", gap: 20 }}>
            <button onClick={() => {
                setTableData(prve => [...prve, { id: (prve[prve.length - 1]?.id ?? 0) + 1, name: '', age: 0, department: '', salary: 0 }])
            }}>+</button>
            <input onChange={(event) => {
                const keyword = event.target.value;
                setFilteredTableData(() => { // filter data by keyword
                    if (keyword === '') return tableData;
                    const filterData = tableData.filter(item => {
                        const vals = Object.values(item);
                        return vals.some(val => String(val).includes(keyword)); // check one row has some cell values is like the keyword or not 
                    })
                    console.log('filterData: ', filterData);
                    return filterData;
                })
            }}></input>
        </div>
        <table>
            <thead>
                <tr>
                    {columns.map(item => (<th key={item}>{item}</th>))}
                    <th>action</th>
                </tr>
            </thead>
            <tbody>
                {filteredTableData.map((item) => (<tr key={item.id}>
                    {columns.map((key) => (<td key={`${item.id}${key}`}
                        onClick={() => { // click cell change to modify state
                            console.log('click : ', key);
                            setEditProp({ editing: true, editCell: `${item.id}${key}`, editVal: item[key] })
                        }
                        }>  {editProp.editing && `${item.id}${key}` === editProp.editCell && key !== 'id' /* judge this cell is current clicked cell or not */ ? <input
                            autoFocus
                            onChange={(event) => { // update input display value
                                setEditProp(prev => ({ editCell: prev.editCell, editing: true, editVal: event.target.value }))
                            }} value={editProp.editVal}
                            onBlur={() => { // save new row data to table data after the cell lost blur
                                setTableData(prev => prev.map(row => row.id === item.id ? { ...row, [key]: editProp.editVal } : row));
                                setEditProp(prev => ({ ...prev, editing: false }));
                            }}></input> : item[key]}</td>))}
                    <td>
                        <button onClick={() => {
                            setTableData(prev => prev.filter(row => row.id !== item.id));
                        }}>delete</button>
                    </td>
                </tr>))}
            </tbody>
        </table>
    </div >
}

export default Table;
/*  **题目要求**:在我们系统中，需要实现一个物料管理模块，需求如下:
可以在页面中<u>(添加/修改/删除/查询)</u>物料
2.物料列表表头:1D，名称，图片，颜色，数量，创建时间，修改时间，操作(图片和时间无需特殊处理使用string就行)
3.可以按照名称搜索物料，搜索结果显示在同一列表即可(不需要考虑模糊搜索，使用 String.includes函数即可)|
4.重置搜索后，物料列表应显示所有已添加物料
5、名称，图片，颜色，数量 是通过输入获取值的
*加分项-自动化测试**:从下面选择一种工具编写脚本(**playwright 或Cypress**)，覆盖核心流程至少覆盖:添加物料、搜索物料、重置搜索、删除物料、修改物料。测试用例需要独立运行，不相互依赖。
**注意事项**:
不允许使用除了 react + typescript template (npm create vite@latest ny-app -- --template react-ts) 之外的其他 package2、UI 效果并不作为考察范围3、不需要考虑后端接口，数据存入 state中即可
英理园志器的理优视市码统中，参考文皆只查看ac城者北相关等官方的接口文档6、<u>不允许使用AI 包括编辑器里面的AI插件，如有安装请先禁用</u>
7、需求完成时间60min左右 加分项另算时间 */