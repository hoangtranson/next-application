import { STATUS } from '../constants';

export const Message = props => {
    if (props.message.status === STATUS.FAIL) {
        return (
            <div className="alert alert-danger" role="alert">
                {props.message.text}
            </div>
        )
    }

    if (props.message.status === STATUS.OK) {
        return (
            <div className="alert alert-success" role="alert">
                {props.message.text}
            </div>
        )
    }

    return null;
}