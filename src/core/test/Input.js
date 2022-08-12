import React, {forwardRef } from 'React';

const Input = forwardRef((props, ref) => {
    return <input ref={ref} {...props} />;
});