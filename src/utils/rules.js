import validateNum from '@/utils/elementFormVerify'
const entryRules = {
    bookName: [{
        required: true,
        message: '书名不能为空'
    }],
    author: [{
        required: true,
        message: '作者不能为空'
    }],
    isbn: [{
        required: true,
        message: 'ISBN号不能为空'
    }],
    price: [{
        required: true,
        message: '价格不能为空'
    },
    {
        validator: validateNum,
        trigger: 'blur'
    },
    ],
    bookCategoryID: [{
        required: true,
        message: '分类号不能为空'
    }],
    count: [{
        required: true,
        message: '数量不能为空'
    },
    {
        type: 'number',
        message: '数量必须为数字值'
    },
    {
        validator: validateNum,
        trigger: 'blur'
    },
    ],
    img: [{
        required: true,
        message: '请选择封面'
    }],
}
const menuRules = {
    bookName: [{
        required: true,
        message: '书名不能为空',
    },],
    author: [{
        required: true,
        message: '作者不能为空',
    },],
    isbn: [{
        required: true,
        message: 'ISBN号不能为空',
    },],
    price: [{
        required: true,
        message: '价格不能为空',
    },
    {
        type: 'number',
        message: '价格必须为数字',
    },
    {
        validator: validateNum,
        trigger: 'blur',
    },
    ],
    bookCategoryID: [{
        required: true,
        message: '分类号不能为空',
    },],
    count: [{
        required: true,
        message: '数量不能为空',
    },
    {
        type: 'number',
        message: '数量必须为数字值',
    },
    {
        validator: validateNum,
        trigger: 'blur',
    },
    ],
}
export default { entryRules, menuRules }