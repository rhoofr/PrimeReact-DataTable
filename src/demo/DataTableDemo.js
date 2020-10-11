import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';
import ReactDOM from 'react-dom';

import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CustomerService } from '../service/CustomerService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressBar } from 'primereact/progressbar';
import './DataTableDemo.css';

const DataTableDemo = () => {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedRepresentatives, setSelectedRepresentatives] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const dt = useRef(null);
    const representatives = [
        {name: "Amy Elsner", image: 'amyelsner.png'},
        {name: "Anna Fali", image: 'annafali.png'},
        {name: "Asiya Javayant", image: 'asiyajavayant.png'},
        {name: "Bernardo Dominic", image: 'bernardodominic.png'},
        {name: "Elwin Sharvill", image: 'elwinsharvill.png'},
        {name: "Ioni Bowcher", image: 'ionibowcher.png'},
        {name: "Ivan Magalhaes",image: 'ivanmagalhaes.png'},
        {name: "Onyama Limba", image: 'onyamalimba.png'},
        {name: "Stephen Shaw", image: 'stephenshaw.png'},
        {name: "XuXue Feng", image: 'xuxuefeng.png'}
    ];

    const statuses = [
        'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
    ];

    const customerService = new CustomerService();

    useEffect(() => {
        customerService.getCustomersLarge().then(data => setCustomers(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const renderHeader = () => {
        return (
            <div className="table-header">
                List of Customers
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
                </span>
            </div>
        );
    }

    const activityBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={rowData.activity} showValue={false} />
            </React.Fragment>
        );
    }

    const actionBodyTemplate = () => {
        return (
            <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Status</span>
                <span className={classNames('customer-badge', 'status-' + rowData.status)}>{rowData.status}</span>
            </React.Fragment>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </React.Fragment>
        );
    }

    const countryBodyTemplate = (rowData) => {
        let { name, code } = rowData.country;

        return (
            <React.Fragment>
                <span className="p-column-title">Country</span>
                <img src="showcase/demo/images/flag_placeholder.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={name} className={classNames('flag', 'flag-' + code)} />
                <span style={{verticalAlign: 'middle', marginLeft: '.5em'}}>{name}</span>
            </React.Fragment>
        );
    }

    const representativeBodyTemplate = (rowData) => {
        const src = "showcase/demo/images/avatar/" + rowData.representative.image;

        return (
            <React.Fragment>
                <span className="p-column-title">Representative</span>
                <img alt={rowData.representative.name} src={src} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{verticalAlign: 'middle'}} />
                <span style={{verticalAlign: 'middle', marginLeft: '.5em'}}>{rowData.representative.name}</span>
            </React.Fragment>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Date</span>
                <span>{rowData.date}</span>
            </React.Fragment>
        );
    }

    const renderRepresentativeFilter = () => {
        return (
            <MultiSelect className="p-column-filter" value={selectedRepresentatives} options={representatives}
                onChange={onRepresentativeFilterChange} itemTemplate={representativeItemTemplate} placeholder="All" optionLabel="name" optionValue="name" />
        );
    }

    const representativeItemTemplate = (option) => {
        const src = "showcase/demo/images/avatar/" + option.image;

        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={src} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width="32" style={{verticalAlign: 'middle'}} />
                <span style={{verticalAlign: 'middle', marginLeft: '.5em'}}>{option.name}</span>
            </div>
        );
    }

    const onRepresentativeFilterChange = (event) => {
        dt.current.filter(event.value, 'representative.name', 'in');
        setSelectedRepresentatives(event.value);
    }

    const renderDateFilter = () => {
        return (
            <Calendar value={dateFilter} onChange={onDateFilterChange} placeholder="Registration Date" dateFormat="yy-mm-dd" className="p-column-filter" />
        );
    }

    const onDateFilterChange = (event) => {
        if (event.value !== null)
            dt.current.filter(formatDate(event.value), 'date', 'equals');
        else
            dt.current.filter(null, 'date', 'equals');

        setDateFilter(event.value);
    }

    const filterDate = (value, filter) => {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === formatDate(filter);
    }

    const formatDate = (date) => {
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    }

    const renderStatusFilter = () => {
        return (
            <Dropdown value={selectedStatus} options={statuses} onChange={onStatusFilterChange}
                        itemTemplate={statusItemTemplate} showClear placeholder="Select a Status" className="p-column-filter"/>
        );
    }

    const statusItemTemplate = (option) => {
        return (
            <span className={classNames('customer-badge', 'status-' + option)}>{option}</span>
        );
    }

    const onStatusFilterChange = (event) => {
        dt.current.filter(event.value, 'status', 'equals');
        setSelectedStatus(event.value);
    }

    const header = renderHeader();
    const representativeFilterElement = renderRepresentativeFilter();
    const dateFilterElement = renderDateFilter();
    const statusFilterElement = renderStatusFilter();

    return (
        <div className="datatable-doc-demo">
            <div className="card">
                <DataTable ref={dt} value={customers}
                    header={header} className="p-datatable-customers" dataKey="id" rowHover globalFilter={globalFilter}
                    selection={selectedCustomers} onSelectionChange={e => setSelectedCustomers(e.value)}
                    paginator rows={10} emptyMessage="No customers found" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}>
                    <Column selectionMode="multiple" style={{width:'3em'}}/>
                    <Column field="name" header="Name" body={nameBodyTemplate} sortable filter filterPlaceholder="Search by name" />
                    <Column sortField="country.name" filterField="country.name" header="Country" body={countryBodyTemplate} sortable filter filterMatchMode="contains" filterPlaceholder="Search by country"/>
                    <Column sortField="representative.name" filterField="representative.name" header="Representative" body={representativeBodyTemplate} sortable filter filterElement={representativeFilterElement} />
                    <Column field="date" header="Date" body={dateBodyTemplate} sortable filter filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement} />
                    <Column field="status" header="Status" body={statusBodyTemplate} sortable filter filterElement={statusFilterElement} />
                    <Column field="activity" header="Activity" body={activityBodyTemplate} sortable filter filterMatchMode="gte" filterPlaceholder="Minimum" />
                    <Column body={actionBodyTemplate} headerStyle={{width: '8em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                </DataTable>
            </div>
        </div>
    );
}
                
const rootElement = document.getElementById("root");
ReactDOM.render(<DataTableDemo />, rootElement);