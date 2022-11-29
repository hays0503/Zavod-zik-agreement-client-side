import { FormItem, FormWrap } from "./FragmentItemWrap";

export const FragmentCustomView = (props) => {
	return (
		<>
			{props.custom_area?.map((item) => {
				return <FormWrap>{FormItem(item?.key, item?.data)}</FormWrap>;
			})}
		</>
	);
};
