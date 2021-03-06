//国籍
const nations = () => {
    return [
        // { label: '中国', value: '中国' },
        { "label": "汉族", "value": "汉族" }, { "label": "蒙古族", "value": "蒙古族" }, { "label": "满族", "value": "满族" }, { "label": "朝鲜族", "value": "朝鲜族" }, { "label": "赫哲族", "value": "赫哲族" }, { "label": "达斡尔族", "value": "达斡尔族" }, { "label": "鄂温克族", "value": "鄂温克族" }, { "label": "鄂伦春族", "value": "鄂伦春族" }, { "label": "回族", "value": "回族" }, { "label": "东乡族", "value": "东乡族" }, { "label": "土族", "value": "土族" }, { "label": "撒拉族", "value": "撒拉族" }, { "label": "保安族", "value": "保安族" }, { "label": "裕固族", "value": "裕固族" }, { "label": "维吾尔族", "value": "维吾尔族" }, { "label": "哈萨克族", "value": "哈萨克族" }, { "label": "柯尔克孜族", "value": "柯尔克孜族" }, { "label": "锡伯族", "value": "锡伯族" }, { "label": "塔吉克族", "value": "塔吉克族" }, { "label": "乌孜别克族", "value": "乌孜别克族" }, { "label": "俄罗斯族", "value": "俄罗斯族" }, { "label": "塔塔尔族", "value": "塔塔尔族" }, { "label": "藏族", "value": "藏族" }, { "label": "门巴族", "value": "门巴族" }, { "label": "珞巴族", "value": "珞巴族" }, { "label": "羌族", "value": "羌族" }, { "label": "彝族", "value": "彝族" }, { "label": "白族", "value": "白族" }, { "label": "哈尼族", "value": "哈尼族" }, { "label": "傣族", "value": "傣族" }, { "label": "僳僳族", "value": "僳僳族" }, { "label": "佤族", "value": "佤族" }, { "label": "拉祜族", "value": "拉祜族" }, { "label": "纳西族", "value": "纳西族" }, { "label": "景颇族", "value": "景颇族" }, { "label": "布朗族", "value": "布朗族" }, { "label": "阿昌族", "value": "阿昌族" }, { "label": "普米族", "value": "普米族" }, { "label": "怒族", "value": "怒族" }, { "label": "德昂族", "value": "德昂族" }, { "label": "独龙族", "value": "独龙族" }, { "label": "基诺族", "value": "基诺族" }, { "label": "苗族", "value": "苗族" }, { "label": "布依族", "value": "布依族" }, { "label": "侗族", "value": "侗族" }, { "label": "水族", "value": "水族" }, { "label": "仡佬族", "value": "仡佬族" }, { "label": "壮族", "value": "壮族" }, { "label": "瑶族", "value": "瑶族" }, { "label": "仫佬族", "value": "仫佬族" }, { "label": "毛南族", "value": "毛南族" }, { "label": "京族", "value": "京族" }, { "label": "土家族", "value": "土家族" }, { "label": "黎族", "value": "黎族" }, { "label": "畲族", "value": "畲族" }, { "label": "高山族", "value": "高山族" }
    ]
}
//政治面貌
const politicalOutlooks = () => {
    return [{ label: '共青团员', value: '共青团员' },
    { label: '中共预备党员', value: '中共预备党员' },
    { label: '中共党员', value: '中共党员' },
    { label: '群众', value: '群众' }
    ]
}
//学历
const educations = () => {
    return [{ label: '高中以下', value: '高中以下' },
    { label: '高中', value: '高中' },
    { label: '中专/技校', value: '中专/技校' },
    { label: '大专', value: '大专' },
    { label: '本科', value: '本科' },
    { label: '硕士', value: '硕士' },
    { label: '博士', value: '博士' }
    ]
}
//书籍借阅的表头（借阅记录、借阅统计）
const bookHeader = () => {
    return [{
        prop: 'bdate',
        label: '借出日期',
        width: '150',
        sortable: true,
    },
    {
        prop: 'dueDate',
        label: '应还日期',
        width: '150',
    },
    {
        prop: 'rdate',
        label: '归还日期',
        width: '150',
    },
    {
        prop: 'overday',
        label: '逾期天数',
        width: '100',
    },
    {
        prop: 'book.bookName',
        label: '书刊名称',
        width: '170',
    }, {
        prop: 'book.id',
        label: '书刊条码',
        width: '120',
    },
    {
        prop: 'member.memberName',
        label: '借书人姓名',
        width: '120',
    },
    {
        prop: 'member.id',
        label: '借书人用户名',
        width: '120',
    },
    ]
}
const startYear = () => {
    const startYearList = []
    const currentYear = new Date().getFullYear() //当前年份
    for (let i = currentYear; i >= 2010; i--) startYearList.push(i) //从当前年份往后遍历
    return startYearList
}
export default { nations, politicalOutlooks, educations, startYear, bookHeader }