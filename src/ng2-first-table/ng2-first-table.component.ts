import { Component, Input, Output, SimpleChange, EventEmitter, OnChanges, ElementRef } from '@angular/core';

import { Grid } from './lib/grid';
import { DataSource } from './lib/data-source/data-source';
import { Row } from './lib/data-set/row';
import { deepExtend } from './lib/helpers';
import { LocalDataSource } from './lib/data-source/local/local.data-source';

import { HttpUrlEncodingCodec } from '@angular/common/http';

@Component({
    selector: 'ng2-first-table',
    styleUrls: ['./ng2-first-table.component.scss'],
    templateUrl: './ng2-first-table.component.html',
})
export class Ng2FirstTableComponent implements OnChanges {

    @Input() source: any;
    @Input() settings: Object = {};

    @Output() rowSelect = new EventEmitter<any>();
    @Output() userRowSelect = new EventEmitter<any>();
    // 自定义单元行 双击事件
    @Output() dbSelect = new EventEmitter<any>();
    // 自定义工具栏 新增事件
    @Output() toolAdd = new EventEmitter<any>();
    // 自定义工具栏 编辑事件
    @Output() toolEdit = new EventEmitter<any>();
    // 自定义工具栏 删除事件
    @Output() toolDelete = new EventEmitter<any>();


    @Output() delete = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();
    @Output() create = new EventEmitter<any>();
    @Output() custom = new EventEmitter<any>();
    @Output() deleteConfirm = new EventEmitter<any>();
    @Output() editConfirm = new EventEmitter<any>();
    @Output() createConfirm = new EventEmitter<any>();
    // @Output() rowHover: EventEmitter<any> = new EventEmitter<any>();

    tableClass: string;
    tableId: string;
    isHideHeader: boolean;
    isHideSubHeader: boolean;
    isPagerDisplay: boolean;
    rowClassFunction: Function;

    // 自定义隔行换色
    rowBgc: object;
    // 自定义表头背景色
    theadBgc: object;
    // 自定义当前点击的背景色
    clickBgc: object;
    // 自定义工具栏是否显示
    tool: boolean;

    // 自定义工具栏小计
    trToolSubtotalIsShow = false;
    trtoolSubtotalArr: any = [];
    trSubtotalData: any = [];
    trSelectArr: any = [];
    isIndx = 0;
    // 自定义工具栏总计
    trToolTotalIsShow = false;
    trToolTotalData: any = [];
    newObj: any;

    // 工具栏自定义-行高
    setTrHeight: any;

    // 工具栏自定义 - 行拖动
    rowDown: any;
    rowIndex: any;
    isBeg: any;
    isToDrop: any;

    // 自定义工具栏需要的行数据
    toolNeedData: object = {};

    // 自定义工具栏-设置-查看明细-默认没有选中数据为不显示
    allowToInsertData: any = {
        isShow: false,
    };

    // 遮罩层
    zheZhaoIsShow: any = {};

    // 自定义列设置-格式化列
    columnFormatPar: any;
    columnFormatId: any;
    grid: Grid;
    defaultSettings: Object = {
        mode: 'inline', // inline|external|click-to-edit
        selectMode: 'single', // single|multi|'dblclick'|'allEvent'
        // 单击 是否多选
        danjiIsMultion: false,
        hideHeader: false,
        hideSubHeader: false, // 隐藏搜索

        actions: {
            columnTitle: 'Actions',
            add: true,
            edit: true,
            delete: true,
            custom: [],
            position: 'left', // left|right
        },
        filter: {
            inputClass: '',
        },
        edit: {
            inputClass: '',
            editButtonContent: '编辑',
            saveButtonContent: '确定',
            cancelButtonContent: '取消',
            confirmSave: false,
        },
        add: {
            inputClass: '',
            addButtonContent: '新增',
            createButtonContent: '确定',
            cancelButtonContent: '取消',
            confirmCreate: false,
        },
        delete: {
            deleteButtonContent: '删除',
            confirmDelete: false,
        },
        attr: {
            id: '',
            class: '',
        },
        noDataMessage: 'No data found',
        columns: {},
        pager: {
            display: true,
            perPage: 10,
        },
        rowClassFunction: () => "",

        // 自定义隔行换色
        rowBgc: {
            isShow: false,
            oddBgc: 'red',
            evenBgc: 'blue',
        },

        // 自定义当前点击的背景色
        clickBgc: {
            isShow: false,
            bgc: '#22a9b6',
        },

        // 自定义表头颜色
        theadBgc: {
            isShow: false,
            bgc: '#22a9b6',
        },

        // 自定义工具栏
        toolData: {
            isShow: false,
            toolAdd: {
                isShow: false,
                liClass: '',
                toolAddContent: '新增',
                confirmAdd: false,
            },
            toolDelete: {
                isShow: false,
                liClass: '',
                toolDeleteContent: '删除',
                confirmDelete: false,
            },
            toolEdit: {
                isShow: false,
                liClass: '',
                toolEditContent: '编辑',
                confirmEdit: false,
            },
            exportExcel: {
                isShow: false,
                liClass: '',
                exportExcelContent: '导出Excel',
            },
            summary: {
                isShow: false,
                toolSubtotal: {
                    isShow: false,
                    liClass: '',
                    toolSubtotalContent: '小计',
                },
                toolTotal: {
                    isShow: false,
                    liClass: '',
                    toolTotalContent: '总计',
                },
            },
            columnSetting: {
                isShow: false,
                // 设置行高
                setTrHieht: {
                    isShow: false,
                    setTrHiehtContent: '设置行高',
                    default: 20,
                },
                // 单行选中行拖动
                setTrMove: {
                    isShow: false,
                    setTrMoveContent: '选中行拖动',
                },
                // 查看明细
                details: {
                    isShow: false,
                    detailsContent: '查看明细',
                }
            },
        },

        // 自定义列设置
        columnSetting: {
            isShow: true,
            columnFormat: {
                isShow: true,
                content: '列控制',
                optional: '￥$%',
            },
        },
    };

    isAllSelected: boolean = false;

    constructor(public el: ElementRef) {

    }
    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (this.grid) {
            if (changes['settings']) {
                this.grid.setSettings(this.prepareSettings());
            }
            if (changes['source']) {
                this.source = this.prepareSource();
                this.grid.setSource(this.source);
            }
        } else {
            this.initGrid();
        }
        this.tableId = this.grid.getSetting('attr.id');
        this.tableClass = this.grid.getSetting('attr.class');
        this.isHideHeader = this.grid.getSetting('hideHeader');
        this.isHideSubHeader = this.grid.getSetting('hideSubHeader');
        this.isPagerDisplay = this.grid.getSetting('pager.display');
        this.rowClassFunction = this.grid.getSetting('rowClassFunction');

        // 自定义隔行换色
        this.rowBgc = this.grid.getSetting('rowBgc');
        // 自定义表头背景色
        this.theadBgc = this.grid.getSetting('theadBgc');
        // 自定义当前点击的背景色
        this.clickBgc = this.grid.getSetting('clickBgc');

        // 自定义工具栏
        this.tool = this.grid.getSetting('toolData').isShow;
        this.grid.dataSet['columns'].forEach(el => {
            this.trtoolSubtotalArr.push(el.id);
        })
    }

    editRowSelect(row: Row) {
        if (this.grid.getSetting('selectMode') === 'multi' || this.grid.getSetting('selectMode') === 'allEvent') {
            this.onMultipleSelectRow(row);
        } else {
            this.onSelectRow(row);
        }
    }


    onUserSelectRow(row: Row) {

        if (this.grid.getSetting('selectMode') === 'single' || this.grid.getSetting('selectMode') === 'allEvent') {
            this.grid.selectRow(row);
            this.emitUserSelectRow(row);
            this.emitSelectRow(row);
        }

        // 小计需要用到的数据
        this.trSubtotalData = this.grid.getSelectedRows();
        this.subtotal(this.isAddOrDel(this.isIndx, this.trSubtotalData.length));

        // 工具栏需要用到的数据
        this.toolNeedData = {
            isDuoHang: this.grid.getSelectedRows().length > 1 ? true : false,
            datas: this.grid.getSelectedRows(),
        };

        // 工具栏-设置-查看明细-每次更换行都不需要显示明细
        this.allowToInsertData.isShow = false;

    }
    // 自定义单元行 双击事件
    ondblclick(row: Row) {
        if (this.grid.getSetting('selectMode') === 'dblclick' || this.grid.getSetting('selectMode') === 'allEvent') {
            this.grid.selectRow(row);
            this.emitDblSelectRow(row);
        }
    }
    // 自定义工具栏 新增事件
    onToolAdd() {
        this.toolAdd.emit();
    }

    // 自定义工具栏 编辑事件
    onToolEdit(event: any) {
        this.toolEdit.emit();
    }

    // 自定义工具栏 删除事件
    onToolDelete(event: any) {
        this.toolDelete.emit();
    }

    // 自定义工具栏 小计
    onToolSubtotal(event: any) {
        this.trToolSubtotalIsShow = event.target.checked;
        this.subtotal(false);
    }

    // 自定义工具栏 总计
    onToolTotal(event: any) {
        this.trToolTotalIsShow = event.target.checked;
        this.trToolTotalData = this.huizong(this.trtoolSubtotalArr.concat([]), this.grid.dataSet['rows']);
    }

    // 自定义工具栏 行高
    trHeight(event: any) {
        this.setTrHeight = event;
    }

    // 是否允许工具栏 行拖动
    isDrop(event: any) {
        this.isToDrop = event;
    }

    // 自定义工具栏行拖动-onmousedown
    onmousedown(event: any) {
        if (this.isToDrop) {
            if (event[1].isSelected) {
                this.isBeg = true;
                let o = event[0].target;
                while (o.rowIndex == undefined) {
                    o = o.parentNode;
                }
                this.rowIndex = this.grid.getSetting('hideSubHeader') ? o.rowIndex - 1 : o.rowIndex - 2;
                this.rowDown = event[1];
            }
        }
    }
    // 自定义工具栏行拖动-onkeydown
    onmouseup(event: any) {
        if (this.isToDrop) {
            // 当鼠标松开的时候，把鼠标按下的那个元素移动到这个元素的上面
            let o = event[0].target;
            while (o.rowIndex == undefined) {
                o = o.parentNode;
            }
            let endIndex = this.grid.getSetting('hideSubHeader') ? o.rowIndex - 1 : o.rowIndex - 2;
            if (this.isBeg) {
                this.grid.dataSet['rows'].splice(this.rowIndex, 1);
                this.grid.dataSet['rows'].splice(endIndex, 0, this.rowDown);
                this.grid.dataSet['rows'].forEach((el, i) => {
                    el.index = i;
                })
                this.isBeg = false;
            }
        }
    }

    // 自定义工具栏-设置-查看明细
    allowToInsert(event: any) {
        let contBox = `<div>我是虚拟DOM</div>`;

        this.allowToInsertData.isShow = event;
        this.allowToInsertData.colspan = this.grid.dataSet['columns'].length;
        this.allowToInsertData.content = contBox;


        if (event) {
            setTimeout(() => {
                this.trSelectArr = [];
                let tbody = this.el.nativeElement.querySelector('tbody');
                let needChaTr = this.el.nativeElement.querySelector('.allowToInsert');
                this.trSubtotalData.forEach((el: any) => {
                    this.trSelectArr.push(el.index);
                });
                let haveTr = tbody.children[Math.max.apply(null, this.trSelectArr) + 1];
                tbody.insertBefore(needChaTr, haveTr);
            }, 1)
        }
    }

    // 自定义工具栏-设置-导出Excel
    exportExcelFn(event: any) {
        let enc = new HttpUrlEncodingCodec();
        let table = this.el.nativeElement.querySelector('table');
        let uri = 'data:application/vnd.ms-excel;base64,',
            template = `<html><meta http-equiv="Content-Type" charset=utf-8"><head></head><body><table border="1" spellcheck="0">{table}</table></body></html>`,
            base64 = (s: any) => {
                return window.btoa(enc.decodeKey(s))
            },
            format = function (s: any, c: any) {
                return s.replace(/{(\w+)}/g, (m: any, p: any) => {
                    return c[p];
                })
            };
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
        // enc.decodeKey(format(template, ctx)))
        // console.info(enc.decodeKey(format(template, ctx)));
    }

    // 自定义列设置-列格式化
    onColumnFormatPar(event: any) {
        this.columnFormatPar = event[0];
        this.columnFormatId = event[1];
        this.initGrid();
    }
    multipleSelectRow(event: any) {
        event[0].stopPropagation();
        const row = event[1];
        if (this.grid.getSetting('selectMode') === 'multi' || this.grid.getSetting('selectMode') === 'allEvent') {
            this.grid.multipleSelectRow(row);
            this.emitUserSelectRow(row);
            this.emitSelectRow(row);
            this.emitDblSelectRow(row);
        }
    }

    onSelectAllRows($event: any) {
        this.isAllSelected = !this.isAllSelected;
        this.grid.selectAllRows(this.isAllSelected);
        this.emitUserSelectRow(null);
        this.emitSelectRow(null);
        this.emitDblSelectRow(null);
    }

    onSelectRow(row: Row) {
        this.grid.selectRow(row);
        this.emitSelectRow(row);
    }

    onMultipleSelectRow(row: Row) {
        this.emitSelectRow(row);
    }

    initGrid() {
        if (this.columnFormatPar || this.columnFormatPar === "") {
            this.source.data.forEach((el: any) => {
                if(el[this.columnFormatId].length > 1 || this.columnFormatPar === ""){
                    el[this.columnFormatId] = el[this.columnFormatId].substring(0,1);
                }
                el[this.columnFormatId] = '' + el[this.columnFormatId] + this.columnFormatPar;
            });
        }
        this.source = this.prepareSource();
        this.grid = new Grid(this.source, this.prepareSettings());
        this.grid.onSelectRow().subscribe((row) => this.emitSelectRow(row));
    }

    prepareSource(): DataSource {

        if (this.source instanceof DataSource) {
            return this.source;
        } else if (this.source instanceof Array) {
            return new LocalDataSource(this.source);
        }

        return new LocalDataSource();
    }

    prepareSettings(): Object {
        return deepExtend({}, this.defaultSettings, this.settings);
    }

    changePage($event: any) {
        this.resetAllSelector();
    }

    sort($event: any) {
        this.resetAllSelector();
    }

    filter($event: any) {
        this.resetAllSelector();
    }

    private resetAllSelector() {
        this.isAllSelected = false;
    }

    private emitUserSelectRow(row: Row) {
        const selectedRows = this.grid.getSelectedRows();
        this.userRowSelect.emit({
            data: row ? row.getData() : null,
            isSelected: row ? row.getIsSelected() : null,
            source: this.source,
            selected: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : [],
        });
    }

    private emitSelectRow(row: Row) {
        const selectedRows = this.grid.getSelectedRows();
        this.rowSelect.emit({
            data: row ? row.getData() : null,
            isSelected: row ? row.getIsSelected() : null,
            source: this.source,
            selected: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : [],
        });
    }

    private emitDblSelectRow(row: Row) {
        const selectedRows = this.grid.getSelectedRows();
        this.dbSelect.emit({
            data: row ? row.getData() : null,
            isSelected: row ? row.getIsSelected() : null,
            source: this.source,
            selected: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : [],
        });
    }

    // 汇总方法
    huizong(data: any, needData: any): any {
        let begData = data.concat([]),
            endData = data.concat([]);
        this.newObj = {};
        begData.forEach((el: any, i: any) => {
            this.newObj[el] = [];
            needData.forEach((el1: any) => {
                if (el !== 'id' && !isNaN(el1.data[el] * 1)) {
                    this.newObj[el].push(el1.data[el] * 1);
                }
            });
            this.newObj[el] = eval(this.newObj[el].join("+"));
        });
        endData.forEach((el: any, i: any) => {
            if (this.newObj[el] !== undefined) {
                endData[i] = this.newObj[el];
            } else {
                endData[i] = '';
            }
        });
        return endData;
    };

    // 小计插入
    subtotal(isAddOrDel: boolean) {
        if (this.trToolSubtotalIsShow) {
            setTimeout(() => {
                this.trSelectArr = [];
                let tbody = this.el.nativeElement.querySelector('tbody');
                let needChaTr = this.el.nativeElement.querySelector('.subtotal');
                this.trSubtotalData.forEach((el: any) => {
                    this.trSelectArr.push(el.index);
                });
                let haveTr;
                if (isAddOrDel) {
                    if (this.isIndx === 1) {
                        haveTr = tbody.children[Math.max.apply(null, this.trSelectArr) + 1];
                    } else {
                        haveTr = tbody.children[Math.max.apply(null, this.trSelectArr) + 2];
                    }
                } else {
                    haveTr = tbody.children[Math.max.apply(null, this.trSelectArr) + 1];
                }

                tbody.insertBefore(needChaTr, haveTr);
            }, 1)
        }
    }

    // 判断是加是减
    isAddOrDel(n1: number, n2: number) {
        if (n2 - n1 > 0) {
            this.isIndx = n2;
            return true;
        } else if (n2 - n1 < 0) {
            this.isIndx = n2;
            return false;
        }
    }

    // 遮罩层
    isZhezhaoShow(event: any) {
        this.zheZhaoIsShow = event;
        setTimeout(() => {
            this.zheZhaoIsShow.isShow = false;
        }, 2000);
    }


}
