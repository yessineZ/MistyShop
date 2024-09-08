import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";


const PasswordStrength = ({password}) => {
    const criteria = [
        {label : "At least 6 characters", met : password.length >=6},
        {label : "Contains at least one uppercase letter", met : /[A-Z]/.test(password)},
        {label : "Contains at least one lowercase letter", met : /[a-z]/.test(password)},
        {label : "Contains at least one number", met : /[0-9]/.test(password)},
        {label : "Contains at least one special character", met : /[!@#$%^&*()_+\-=\[\ //]/.test(password) }
    ]

    return (
        <div className="mt-2 space-y-1">
            {criteria.map((item) => (
            <div key={item.label} className="flex items-center text-xs">
                {item.met ? (
                    <FaCheck className="text-green-500 size-5 mr-2" /> ) : 
                    <ImCross className="text-red-500 size-5 mr-2" /> 
                }
                <span className={item.met ? 'text-green-500' : 'text-gray-500'}>{item.label}</span>
                
            </div>
            )  )}
        </div>
    )

}

const PasswordStrengthMeter = ({password}) => {
    const getStrength = (pass) => {
        let strength = 0
        if (pass.length >= 6) strength += 1
        if (/[A-Z]/.test(pass)) strength += 1
        if (/[a-z]/.test(pass)) strength += 1
        if (/[0-9]/.test(pass)) strength += 1
        if (/[!@#$%^&*()_+\-=\[\]{}|;':"\\|,.<>\/?]/.test(pass)) strength += 1
        return strength
    }

    const getColor = (strength) => {
        switch (strength) {
            case 0: return 'bg-danger'
            case 1: return 'bg-warning'
            case 2: return 'bg-success2'
            case 3: return 'bg-success' 
            case 4: return 'bg-success'
            default: return 'bg-success'
        }
    };

    const strength = getStrength(password) ;

    const getStrengthText = (strength) => {
        if(strength ===0) return 'Very Weak' ;
        if(strength ===1) return 'Weak' ;
        if(strength ===2) return 'Medium' ;
        if(strength ===3) return 'Good' ;
        return "Strong" ;
    }

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Password strength</span>         
                <span className="text-xs text-gray-400 underline">{getStrengthText(strength)}</span>
            </div>

            <div className="flex space-x-1">
                {[...Array(4)].map((_,index) => (
                    <div key={index} className={`rounded-full h-3 w-1/4 transition-colors duration-300 ${index < strength ? getColor(strength) : 'bg-gray-600' }`}/>
                    
                ))
}

            </div>

            <PasswordStrength password={password} />

        </div>
    )
}

export default PasswordStrengthMeter ; 