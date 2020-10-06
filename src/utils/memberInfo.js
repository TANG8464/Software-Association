function getNations() {
    return [
        { label: '中国', value: '中国' }
    ]
}

function getPoliticalOutlooks() {
    return [{ label: '共青团员', value: '共青团员' },
        { label: '中共预备党员', value: '中共预备党员' },
        { label: '中共党员', value: '中共党员' },
        { label: '群众', value: '群众' }
    ]
}

function getEducations() {
    return [{ label: '高中以下', value: '高中以下' },
        { label: '高中', value: '高中' },
        { label: '中专/技校', value: '中专/技校' },
        { label: '大专', value: '大专' },
        { label: '本科', value: '本科' },
        { label: '硕士', value: '硕士' },
        { label: '博士', value: '博士' }
    ]
}

const memberInfo = {
    nations: getNations(),
    politicalOutlooks: getPoliticalOutlooks(),
    educations: getEducations()
}
export default memberInfo